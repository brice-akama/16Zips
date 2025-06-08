import { NextRequest, NextResponse } from "next/server";
import clientPromise from '../../lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { eventType, eventData, timestamp } = await req.json();
    const client = await clientPromise;
    const db = client.db('school-project');
    const collection = db.collection("analytics");

    // Track unique visitors
    if (eventType === "visitor") {
      const existingVisitor = await collection.findOne({ "eventData.visitorId": eventData.visitorId });
      if (!existingVisitor) {
        await collection.insertOne({ eventType: "unique_visitor", eventData, timestamp });
      }
    }

    // Track organic traffic
    if (eventType === "organic_traffic") {
      await collection.insertOne({
        eventType: "organic_traffic",
        eventData: { referrer: eventData.referrer },
        timestamp,
      });
    }

    // Track total sales & average order value
    if (eventType === "order_completed") {
      await collection.insertOne({
        eventType: "order_completed",
        eventData: { orderId: eventData.orderId, amount: eventData.amount },
        timestamp,
      });

      // Calculate new AOV
      const totalSales = await collection.aggregate([
        { $match: { eventType: "order_completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$eventData.amount" }, count: { $sum: 1 } } }
      ]).toArray();

      const averageOrderValue = totalSales.length ? totalSales[0].totalRevenue / totalSales[0].count : 0;

      await collection.updateOne(
        { eventType: "average_order_value" },
        { $set: { eventData: { value: averageOrderValue } } },
        { upsert: true }
      );
    }

    // Track conversions (visitors who made a purchase)
    if (eventType === "conversion") {
      await collection.insertOne({ eventType: "conversion", eventData, timestamp });

      const totalVisitors = await collection.countDocuments({ eventType: "unique_visitor" });
      const totalConversions = await collection.countDocuments({ eventType: "conversion" });
      const conversionRate = totalVisitors ? (totalConversions / totalVisitors) * 100 : 0;

      await collection.updateOne(
        { eventType: "conversion_rate" },
        { $set: { eventData: { rate: conversionRate.toFixed(2) } } },
        { upsert: true }
      );
    }
    

    return NextResponse.json({ message: "Event stored successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving analytics:", error);
    return NextResponse.json({ error: "Failed to store analytics" }, { status: 500 });
  }
}

// ✅ GET: Fetch analytics data by ID
// ✅ GET: Fetch analytics data by ID
export async function GET(req: NextRequest) {
  try {
    console.log("📡 Incoming GET request for analytics data:", req.url);

    const client = await clientPromise;
    const db = client.db('school-project');
    const collection = db.collection("analytics");

    // Fetch the necessary metrics using aggregation
    const [conversionRateDoc, averageOrderValueDoc, totalSalesDoc, uniqueVisitorsDoc, organicTrafficDoc, organicTrafficCount] = await Promise.all([
      collection.findOne({ eventType: "conversion_rate" }),
      collection.findOne({ eventType: "average_order_value" }),
      collection.aggregate([
        { $match: { eventType: "order_completed" } },
        { $group: { _id: null, totalRevenue: { $sum: "$eventData.amount" }, totalSales: { $sum: 1 } } }
      ]).toArray(),
      collection.countDocuments({ eventType: "unique_visitor" }),
      collection.findOne({ eventType: "organic_traffic" }),
      collection.countDocuments({ eventType: "organic_traffic" }) // Count of organic traffic events
    ]);

    // Calculate organic traffic rate
    const organicTrafficRate = uniqueVisitorsDoc > 0 ? ((organicTrafficCount / uniqueVisitorsDoc) * 100).toFixed(2) : "0";

    // Prepare the response with the necessary metrics
    const response = {
      uniqueVisitors: uniqueVisitorsDoc || 0,
      pageViews: uniqueVisitorsDoc || 0,  // Assuming page views could be tracked similarly
      conversionRate: conversionRateDoc?.eventData?.rate || 0,
      totalSales: totalSalesDoc?.[0]?.totalSales || 0,
      averageOrderValue: averageOrderValueDoc?.eventData?.value || 0,
      organicTraffic: organicTrafficDoc?.eventData?.referrer || "Direct",
      organicTrafficRate: organicTrafficRate,  // Organic traffic rate in percentage
      pageViewsHistory: []  // If you are tracking page views history, add that logic here
    };

    console.log("✅ Successfully retrieved analytics data:", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}