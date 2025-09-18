import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";
import sanitizeHtml from 'sanitize-html';
import { decode } from 'he';
import nodemailer from "nodemailer";

interface CartItem {
  slug: string;
  name: string;
  mainImage: string;
  price: number;
  quantity: number;
}

interface BillingDetails {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderRequestBody {
  paymentMethod: 'Cash App' | 'Paypal' | 'Zelle' | 'Apple Pay' | 'Venmo' | 'crypto';
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  salesTaxAmount: number;
  discount?: number;
  totalPrice: number;
  billingDetails: BillingDetails;
  orderNotes?: string;
  couponCode?: string;
}

// Sanitize input
function sanitizeInput(input: string): string {
  return sanitizeHtml(decode(input), { allowedTags: [], allowedAttributes: {} });
}

// ✉️ Professional Email Template Generator (NO LOGO)
const generateEmailTemplate = (
  title: string,
  content: string,
  showFooter: boolean = true
): string => {
  const brandColor = "#e3342f"; // 👈 Replace with your brand color
  const siteUrl = "https://16zip.com";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <!-- Header -->
            <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="padding: 30px 20px 20px;">
                  <!-- LOGO REMOVED AS REQUESTED -->
                </td>
              </tr>
              <tr>
                <td style="padding: 0 30px 30px;">
                  <h1 style="color: ${brandColor}; font-size: 24px; font-weight: 600; margin: 0 0 20px;">${title}</h1>
                  ${content}
                </td>
              </tr>
              ${showFooter ? `
              <tr>
                <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                  <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px;">
                    Need help? Contact us at <a href="mailto:support@16zip.com" style="color: ${brandColor}; text-decoration: none;">support@16zip.com</a>
                  </p>
                  <p style="color: #6c757d; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} 16Zip. All rights reserved.<br>
                    <a href="${siteUrl}" style="color: ${brandColor}; text-decoration: none;">Visit our website</a>
                  </p>
                </td>
              </tr>
              ` : ''}
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
  export async function POST(req: Request) {
  try {
    const {
      paymentMethod,
      cartItems: rawCartItems,
      subtotal: rawSubtotal,
      shippingCost: rawShippingCost,
      salesTaxAmount: rawSalesTaxAmount,
      discount: rawDiscount = 0,
      totalPrice: rawTotalPrice,
      billingDetails: rawBillingDetails,
      orderNotes,
      couponCode,
    }: OrderRequestBody = await req.json();

    // ✅ Validate payment method
    const validPaymentMethods = ['Cash App', 'Paypal', 'Zelle', 'Apple Pay', 'Venmo', 'crypto'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method.' }, { status: 400 });
    }

    // ✅ Validate cart
    if (!rawCartItems || rawCartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    // ✅ Sanitize cart items
    const cartItems: CartItem[] = rawCartItems.map((item, index) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      if (!item.slug || !item.name || !item.mainImage || isNaN(price) || isNaN(quantity)) {
        throw new Error(`Invalid cart item at index ${index}`);
      }
      return {
        slug: sanitizeInput(item.slug),
        name: sanitizeInput(item.name),
        mainImage: sanitizeInput(item.mainImage),
        price,
        quantity,
      };
    });

    // ✅ Sanitize billing details
    const billingDetails: BillingDetails = { ...rawBillingDetails };
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'country',
      'streetAddress', 'city', 'state', 'zipCode'
    ];
    for (const field of requiredFields) {
      if (!(billingDetails as any)[field]) {
        return NextResponse.json({ error: `Missing required billing detail: ${field}` }, { status: 400 });
      }
      (billingDetails as any)[field] = sanitizeInput((billingDetails as any)[field]);
    }
    if (billingDetails.companyName) {
      billingDetails.companyName = sanitizeInput(billingDetails.companyName);
    }

    const sanitizedNotes = orderNotes ? sanitizeInput(orderNotes) : undefined;
    const sanitizedCoupon = couponCode ? sanitizeInput(couponCode) : undefined;

    // ✅ Calculate totals if missing
   // ✅ Calculate totals with default shipping
const subtotal = Number(rawSubtotal ?? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));

// Default shipping to $40 if not provided
const shippingCost = Number(rawShippingCost != null && rawShippingCost > 0 ? rawShippingCost : 40);

const salesTaxAmount = Number(rawSalesTaxAmount ?? subtotal * 0.07);
const discount = Number(rawDiscount ?? 0);
const totalPrice = Number(rawTotalPrice ?? subtotal + shippingCost + salesTaxAmount - discount);

    // ✅ Construct order
    const order = {
      orderId: uuidv4(),
      paymentMethod,
      cartItems,
      subtotal,
      shippingCost,
      salesTaxAmount,
      discount,
      totalPrice,
      billingDetails,
      orderNotes: sanitizedNotes,
      couponCode: sanitizedCoupon,
      status: 'pending',
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("school-project");
    const ordersCollection = db.collection('orders');
    const result = await ordersCollection.insertOne(order);

    // ✅ Nodemailer setup
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const createOrderSummaryText = (items: CartItem[]) =>
      items.map(item => `- ${item.name} (x${item.quantity}) - $${item.price.toFixed(2)}`).join('\n');

    const createOrderSummaryHtml = (items: CartItem[]) =>
      `<ul>${items.map(item => `<li><strong>${item.name}</strong> (x${item.quantity}) - $${item.price.toFixed(2)}</li>`).join('')}</ul>`;

    // ✅ Send email to customer
    // ✅ Send email to customer — PROFESSIONAL VERSION (NO LOGO + PAYMENT INFO)
await transporter.sendMail({
  from: `"16Zip Support Team" <info@16zip.com>`,
  to: billingDetails.email,
  subject: "📋 Your 16Zip Order Has Been Received",
  html: generateEmailTemplate(
    "Thank you for your order!",
    `
    <p style="font-size: 16px; color: #495057; line-height: 1.6;">
      Hi ${billingDetails.firstName},<br><br>
      Thank you for placing your order with 16Zip! We’ve received your request and will contact you shortly with payment instructions.
    </p>

    <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 25px 0; border-radius: 4px;">
      <p style="font-size: 14px; color: #856404; margin: 0;">
        <strong>Important:</strong> No payment has been processed yet. Our team will contact you via email or phone with secure payment instructions.
      </p>
    </div>

    <h2 style="color: #343a40; font-size: 20px; margin: 30px 0 15px;">Order Summary</h2>
    ${createOrderSummaryHtml(cartItems)}

    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="color: #495057;">Subtotal:</span>
        <strong style="color: #343a40;">$${subtotal.toFixed(2)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="color: #495057;">Shipping:</span>
        <strong style="color: #343a40;">$${shippingCost.toFixed(2)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="color: #495057;">Sales Tax (7%):</span>
        <strong style="color: #343a40;">$${salesTaxAmount.toFixed(2)}</strong>
      </div>
      ${discount > 0 ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #28a745;">
        <span>Discount:</span>
        <strong>-$${discount.toFixed(2)}</strong>
      </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; border-top: 2px solid #dee2e6; padding-top: 10px; margin-top: 10px;">
        <span style="font-weight: 600; color: #343a40;">Order Total:</span>
        <strong style="font-size: 18px; color: #e3342f;">$${totalPrice.toFixed(2)}</strong>
      </div>
    </div>

    <h2 style="color: #343a40; font-size: 20px; margin: 30px 0 15px;">Delivery Information</h2>
    <p style="font-size: 16px; color: #495057; line-height: 1.6;">
      <strong>Shipping To:</strong><br>
      ${billingDetails.firstName} ${billingDetails.lastName}<br>
      ${billingDetails.streetAddress}<br>
      ${billingDetails.city}, ${billingDetails.state} ${billingDetails.zipCode}<br>
      ${billingDetails.country}
    </p>

    <p style="font-size: 16px; color: #495057; line-height: 1.6; margin-top: 25px;">
      <strong>Order Notes:</strong> ${sanitizedNotes || 'None'}<br>
      <strong>Coupon Code:</strong> ${sanitizedCoupon || 'None'}
    </p>

    <p style="font-size: 16px; color: #495057; line-height: 1.6; margin-top: 25px;">
      We’ll review your order and send you payment instructions within 24 hours. If you have any questions, feel free to reply to this email.
    </p>
    `,
    true
  ).replace(
    // 👇 Remove logo image tag since you don't want a logo
    /<img src="[^"]+" alt="[^"]+" width="\d+" style="[^"]+">/,
    ''
  ),
});
    // ✅ Send email to site owner
    // ✅ Send email to site owner — PROFESSIONAL VERSION (NO LOGO)
await transporter.sendMail({
  from: `"16Zip Orders" <${process.env.EMAIL_USER}>`,
  to: "info@16zip.com",
  subject: `📋 New Order #${order.orderId.substring(0, 8)} - $${totalPrice.toFixed(2)}`,
  html: generateEmailTemplate(
    `New Order Received`,
    `
    <p style="font-size:16px;color:#495057;line-height:1.6;">
  A new order has been placed on your website.
</p>


    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #343a40; margin: 0 0 15px; font-size: 18px;">Order Details</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
        <div><strong>Order ID:</strong> ${order.orderId}</div>
        <div><strong>Date:</strong> ${order.createdAt.toLocaleString()}</div>
        <div><strong>Customer:</strong> ${billingDetails.firstName} ${billingDetails.lastName}</div>
        <div><strong>Email:</strong> ${billingDetails.email}</div>
        <div><strong>Phone:</strong> ${billingDetails.phone}</div>
        <div><strong>Status:</strong> <span style="color: #e3342f; font-weight: 600;">Payment Pending</span></div>
        <div><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</div>
        <div><strong>Shipping:</strong> $${shippingCost.toFixed(2)}</div>
        <div><strong>Tax:</strong> $${salesTaxAmount.toFixed(2)}</div>
        <div><strong>Discount:</strong> $${discount.toFixed(2)}</div>
        <div><strong>Order Total:</strong> <span style="color: #e3342f; font-weight: 600;">$${totalPrice.toFixed(2)}</span></div>
      </div>
    </div>

    <h3 style="color: #343a40; margin: 30px 0 15px; font-size: 18px;">Items Ordered</h3>
    ${createOrderSummaryHtml(cartItems)}

    <h3 style="color: #343a40; margin: 30px 0 15px; font-size: 18px;">Shipping Address</h3>
    <p style="font-size: 16px; color: #495057; line-height: 1.6;">
      ${billingDetails.firstName} ${billingDetails.lastName}<br>
      ${billingDetails.streetAddress}<br>
      ${billingDetails.city}, ${billingDetails.state} ${billingDetails.zipCode}<br>
      ${billingDetails.country}
    </p>

    <h3 style="color: #343a40; margin: 30px 0 15px; font-size: 18px;">Notes & Coupon</h3>
    <p style="font-size: 16px; color: #495057; line-height: 1.6;">
      <strong>Order Notes:</strong> ${sanitizedNotes || 'None'}<br>
      <strong>Coupon Code:</strong> ${sanitizedCoupon || 'None'}
    </p>

    <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 25px 0; border-radius: 4px;">
      <p style="font-size: 14px; color: #856404; margin: 0;">
        <strong>Action Required:</strong> Contact customer to provide payment instructions. No payment has been processed.
      </p>
    </div>

    
    `,
    true
  ).replace(
    // 👇 Remove logo image tag
    /<img src="[^"]+" alt="[^"]+" width="\d+" style="[^"]+">/,
    ''
  ),
});
    return NextResponse.json({
      message: 'Order placed successfully!',
      orderId: result.insertedId.toString(),
      billingDetails,
    }, { status: 200 });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Failed to process the order.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("school-project");
    const ordersCollection = db.collection("orders");

    // If ID is provided, return single order
    if (id) {
      const order = await ordersCollection.findOne({ _id: new ObjectId(id) });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        data: {
          ...order,
          id: order._id.toString(), // Required for React Admin
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          salesTaxAmount: order.salesTaxAmount,
          discount: order.discount || 0,
          orderNotes: order.orderNotes || "",
          couponCode: order.couponCode || "",
        }
      }, { status: 200 });
    }

    // Otherwise return all orders
    const orders = await ordersCollection.find().toArray();
    const formattedOrders = orders.map((order) => ({
      ...order,
      id: order._id.toString(),
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      salesTaxAmount: order.salesTaxAmount,
      discount: order.discount || 0,
      orderNotes: order.orderNotes || "",
      couponCode: order.couponCode || "",
    }));

    return NextResponse.json({
      data: formattedOrders,
      total: formattedOrders.length,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
