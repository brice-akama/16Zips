import clientPromise from "./app/lib/mongodb";


async function checkDB() {
  try {
    const client = await clientPromise;
    const db = client.db("school-project"); // Make sure this matches your API

    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const products = await db.collection("products").find().limit(5).toArray();
    console.log("First 5 products:", products);

    process.exit(0);
  } catch (err) {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  }
}

checkDB();
