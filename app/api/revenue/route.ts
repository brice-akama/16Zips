import { NextResponse } from 'next/server';
import clientPromise from "../../lib/mongodb"; // Adjust the import path

export async function GET() {
  try {
    // Await the clientPromise to get the MongoDB client
    const client = await clientPromise;
    const db = client.db("school-project");

    // Query the database to get the revenue data (group by month)
    const revenueData = await db
      .collection('orders') // Replace with your correct collection
      .aggregate([
        {
          $match: {
            paymentStatus: 'paid', // Only consider paid orders
          },
        },
        {
          $group: {
            _id: { $month: "$orderDate" }, // Group by month
            totalRevenue: { $sum: "$revenue" } // Sum revenue for each month
          }
        },
        {
          $sort: { "_id": 1 } // Sort by month ascending
        },
        {
          $project: {
            month: "$_id",
            revenue: "$totalRevenue",
            _id: 0
          }
        }
      ])
      .toArray();

    // Create an array of all months in the year
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Initialize an object with zero revenue for every month
    // Explicitly declare the type of `revenueMap` as an object with string keys and number values
    const revenueMap: { [key: string]: number } = monthNames.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {} as { [key: string]: number }); // Ensure that `revenueMap` is typed correctly

    // Populate the revenueMap with actual data from the database
    revenueData.forEach((item: any) => {
      const month = monthNames[item._id - 1]; // Convert numeric month to name (use item._id for month)
      revenueMap[month] = item.revenue; // Update revenue for the month
    });

    // Format the result as an array
    const formattedRevenueData = Object.keys(revenueMap).map((month) => ({
      month,
      revenue: revenueMap[month],
    }));

    // Return the revenue data as a JSON response
    return NextResponse.json(formattedRevenueData);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ message: 'Error fetching revenue data' }, { status: 500 });
  }
}