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
    await transporter.sendMail({
      from: `"16Zip Support Team" <info@16zip.com>`,
      to: billingDetails.email,
      subject: "Your 16Zip Order Confirmation",
      text: `
Thank you for your order, ${billingDetails.firstName}!

Order Details:
${createOrderSummaryText(cartItems)}

Subtotal: $${subtotal.toFixed(2)}
Shipping: $${shippingCost.toFixed(2)}
Sales Tax: $${salesTaxAmount.toFixed(2)}
Discount: $${discount.toFixed(2)}
Total Price: $${totalPrice.toFixed(2)}
Payment Method: ${paymentMethod}

Order Notes: ${sanitizedNotes || 'N/A'}
Coupon Code: ${sanitizedCoupon || 'N/A'}

We will contact you shortly.

Regards,
The 16Zip Team
`.trim(),
    });

    // ✅ Send email to site owner
    await transporter.sendMail({
      from: `"16Zip Website" <${process.env.EMAIL_USER}>`,
      to: "info@16zip.com",
      subject: `New Order Received - Order ID: ${order.orderId}`,
      html: `
<h2>New order placed!</h2>
<p><strong>Order ID:</strong> ${order.orderId}</p>
<p><strong>Customer:</strong> ${billingDetails.firstName} ${billingDetails.lastName}</p>
<p><strong>Email:</strong> ${billingDetails.email}</p>
<p><strong>Phone:</strong> ${billingDetails.phone}</p>
<p><strong>Address:</strong> ${billingDetails.streetAddress}, ${billingDetails.city}, ${billingDetails.state}, ${billingDetails.zipCode}, ${billingDetails.country}</p>
<p><strong>Payment Method:</strong> ${paymentMethod}</p>
<p><strong>Items Ordered:</strong></p>
${createOrderSummaryHtml(cartItems)}
<p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
<p><strong>Shipping:</strong> $${shippingCost.toFixed(2)}</p>
<p><strong>Sales Tax:</strong> $${salesTaxAmount.toFixed(2)}</p>
<p><strong>Discount:</strong> $${discount.toFixed(2)}</p>
<p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
<p><strong>Order Notes:</strong> ${sanitizedNotes || 'N/A'}</p>
<p><strong>Coupon Code:</strong> ${sanitizedCoupon || 'N/A'}</p>
<p><em>Order placed on ${order.createdAt.toLocaleString()}</em></p>
`,
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
