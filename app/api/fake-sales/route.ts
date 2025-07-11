// /app/api/fake-sales/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

type ProductType = {
  name: string;
  mainImage?: string;
  thumbnails?: string[];
};

export async function GET() {
  const client = await clientPromise;
  const db = client.db("school-project");

  const products = await db.collection("products").find({}).limit(10).toArray();

  const fakeNames = [
    "James", "Amina", "Luis", "Sarah", "Mohamed", "Léa", "Daniel", "Elena", "John", "Sofia",
  ];

  const fakeLocations = [
    "Toronto", "Berlin", "Los Angeles", "Paris", "Rome", "London", "New York", "Sydney",
  ];

  const data = (products as unknown as ProductType[]).map((prod, idx) => ({
    product: prod.name || "Unnamed Product",
    mainImage:
      prod.mainImage ||
      (prod.thumbnails && prod.thumbnails.length > 0 ? prod.thumbnails[0] : "/fallback.jpg"),
    name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
    location: fakeLocations[idx % fakeLocations.length],
    timeAgo: `${(idx + 1) * 3} minutes ago`,
  }));

  return NextResponse.json(data);
}
