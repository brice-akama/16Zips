import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";
import sanitizeHtml from 'sanitize-html';
import { decode } from 'he';
import nodemailer from "nodemailer";

// Define types
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
  paymentMethod: 'Cash App' | 'Paypal' | 'crypto';
  cartItems: CartItem[];
  totalPrice: number;
  billingDetails: BillingDetails;
}

// Sanitize user input
function sanitizeInput(input: string): string {
  const decoded = decode(input); // decode HTML entities
  return sanitizeHtml(decoded, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

// POST: Place order
export async function POST(req: Request) {
  try {
    console.log("Received POST request for placing order...");

    const {
      paymentMethod,
      cartItems: rawCartItems,
      totalPrice,
      billingDetails: rawBillingDetails
    }: OrderRequestBody = await req.json();

    console.log("Parsed request body:", {
      paymentMethod,
      rawCartItems,
      totalPrice,
      rawBillingDetails
    });

    // Validate payment method
    const validPaymentMethods = ['Cash App', 'Paypal', 'crypto'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      console.error("Invalid payment method:", paymentMethod);
      return NextResponse.json({ error: 'Invalid payment method.' }, { status: 400 });
    }

    // Validate cart
    if (!rawCartItems || rawCartItems.length === 0) {
      console.error("Cart is empty or missing:", rawCartItems);
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    // Sanitize and validate cart items
    const cartItems: CartItem[] = rawCartItems.map((item, index) => {
      try {
        const price = typeof item.price === 'number'
          ? item.price
          : typeof item.price === 'string' && !isNaN(Number(item.price))
          ? Number(item.price)
          : NaN;

        const quantity = typeof item.quantity === 'number'
          ? item.quantity
          : typeof item.quantity === 'string' && !isNaN(Number(item.quantity))
          ? Number(item.quantity)
          : NaN;

        if (
          typeof item.slug !== 'string' ||
          typeof item.name !== 'string' ||
          typeof item.mainImage !== 'string' ||
          isNaN(price) ||
          isNaN(quantity)
        ) {
          console.error(`Invalid cart item at index ${index}:`, item);
          throw new Error("Invalid cart item structure.");
        }

        return {
          slug: sanitizeInput(item.slug),
          name: sanitizeInput(item.name),
          mainImage: sanitizeInput(item.mainImage),
          price,
          quantity,
        };
      } catch (e) {
        console.error(`Error processing cart item at index ${index}:`, e);
        throw e;
      }
    });

    console.log("Validated cart items:", cartItems);

    // Sanitize and validate billing details
    const billingDetails: BillingDetails = { ...rawBillingDetails };
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'country',
      'streetAddress', 'city', 'state', 'zipCode'
    ];

    for (const field of requiredFields) {
      if (!(billingDetails as any)[field]) {
        console.error(`Missing billing detail: ${field}`);
        return NextResponse.json({ error: `Missing required billing detail: ${field}` }, { status: 400 });
      }

      const value = (billingDetails as any)[field];
      if (typeof value !== 'string') {
        console.error(`Invalid type for billing field ${field}:`, value);
        return NextResponse.json({ error: `Invalid type for billing field: ${field}` }, { status: 400 });
      }

      (billingDetails as any)[field] = sanitizeInput(value);
    }

    if (billingDetails.companyName && typeof billingDetails.companyName === 'string') {
      billingDetails.companyName = sanitizeInput(billingDetails.companyName);
    }

    console.log("Validated billing details:", billingDetails);

    // Construct order
    const order = {
      orderId: uuidv4(),
      paymentMethod,
      cartItems,
      totalPrice,
      billingDetails,
      status: 'pending',
      createdAt: new Date(),
    };

    console.log("Constructed order object:", order);

    // Insert to DB
    const client = await clientPromise;
    const db = client.db("school-project");
    const ordersCollection = db.collection('orders');

    console.log("Inserting order into DB...");
    const result = await ordersCollection.insertOne(order);

    console.log("Order inserted successfully:", result.insertedId);


    // --- Email sending part ---

    // Setup nodemailer transporter with Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com", // Your Zoho SMTP host
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER!,   // Your Zoho email user
        pass: process.env.EMAIL_PASS!,   // Your Zoho SMTP password or app-specific password
      },
    });

    // Email content helper function for order summary
    const createOrderSummaryHtml = (cartItems: CartItem[]) => {
      return `
        <ul>
          ${cartItems.map(item => `
            <li>
              <strong>${item.name}</strong> (x${item.quantity}) - $${item.price.toFixed(2)} each
            </li>
          `).join('')}
        </ul>
      `;
    };

    // Send notification email to the customer

function createOrderSummaryText(cartItems: CartItem[]): string {
  return cartItems.map(item =>
    `- ${item.name} (x${item.quantity}) - $${item.price.toFixed(2)}`
  ).join('\n');
}

await transporter.sendMail({
  from: `"16Zip Support Team" <info@16zip.com>`,
  to: billingDetails.email,
  subject: "Your 16Zip Order Confirmation",
  text: `
Thank you for your order, ${billingDetails.firstName}!

We've received your order with the following details:

${createOrderSummaryText(cartItems)}

Total Price: $${totalPrice.toFixed(2)}
Payment Method: ${paymentMethod}

We will contact you shortly regarding the next steps.

If you have any questions, feel free to contact us at info@16zip.com.

Regards,
The 16Zip Team
`.trim(),
});


    // Send notification email to site owner
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
        <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
        <p><em>Order placed on ${order.createdAt.toLocaleString()}</em></p>
      `
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


// GET: Fetch orders


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("school-project");
    const ordersCollection = db.collection("orders");

    // ✅ If ID is provided, return single order with wrapped data
    if (id) {
      const order = await ordersCollection.findOne({ _id: new ObjectId(id) });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({
        data: {
          ...order,
          id: order._id.toString(), // Required for React Admin
        }
      }, { status: 200 });
    }

    // ✅ Otherwise return all orders
    const orders = await ordersCollection.find().toArray();
    const formattedOrders = orders.map((order) => ({
      ...order,
      id: order._id.toString(),
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


// DELETE: Remove order by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("school-project");
    const ordersCollection = db.collection("orders");

    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
