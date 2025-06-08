import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("school-project"); // Replace with your DB name
    const ordersCollection = db.collection("orders");

    console.log("Fetching order status counts...");

    // Aggregate orders based on status
    const statusCounts = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ])
      .toArray();

    // Convert aggregation results to an object format
    const orderStatus = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, { pending: 0, completed: 0, canceled: 0 });

    console.log("Order status breakdown:", orderStatus);

    return NextResponse.json(orderStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching order statuses:", error);
    return NextResponse.json({ error: "Failed to fetch order statuses." }, { status: 500 });
  }
}