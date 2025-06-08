import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from "mongodb";
import sanitizeHtml from 'sanitize-html';
import { decode } from 'he';

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
  paymentMethod: 'venmo' | 'Papal' | 'crypto';
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
    const validPaymentMethods = ['venmo', 'Papal', 'crypto'];
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
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const ordersCollection = db.collection("orders");

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
