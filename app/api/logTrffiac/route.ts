// app/api/logTraffic/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

const blockedCountries = ["CN"]; // Example: Block China, Russia, North Korea

const fetchLocationData = async (ip: string) => {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_API_KEY}`);
    const data = await response.json();
    return {
      ip,
      country: data.country || "Unknown",
      region: data.region || "Unknown",
      city: data.city || "Unknown",
      isp: data.org || "Unknown",
      latitude: data.loc ? data.loc.split(",")[0] : "Unknown",
      longitude: data.loc ? data.loc.split(",")[1] : "Unknown"
    };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return {
      ip,
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      isp: "Unknown",
      latitude: "Unknown",
      longitude: "Unknown"
    };
  }
};

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const trafficCollection = db.collection('traffic');

    const ipAddress = req.headers.get('x-forwarded-for') || "Unknown IP";
    const userAgent = req.headers.get('user-agent');

    let locationData = {
      ip: ipAddress,
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
      isp: "Unknown",
      latitude: "Unknown",
      longitude: "Unknown"
    };

    if (ipAddress !== "Unknown IP") {
      locationData = await fetchLocationData(ipAddress);

      // Block requests from high-risk countries
      if (blockedCountries.includes(locationData.country)) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
    }

    await trafficCollection.insertOne({
      timestamp: new Date(),
      ipAddress: locationData.ip,
      userAgent: userAgent || "Unknown",
      country: locationData.country,
      region: locationData.region,
      city: locationData.city,
      isp: locationData.isp,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    });

    return NextResponse.json({ message: "Traffic logged successfully" });
  } catch (error) {
    console.error("Error logging traffic:", error);
    return NextResponse.json({ message: "Error logging traffic" }, { status: 500 });
  }
}

// Get traffic statistics (Visits by Country)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const trafficCollection = db.collection('traffic');

    const countryStats = await trafficCollection
      .aggregate([
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    return NextResponse.json({ countryStats });
  } catch (error) {
    console.error("Error fetching traffic stats:", error);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
}