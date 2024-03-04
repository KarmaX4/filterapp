
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {

  const { startDate } = params;
  console.log(request);
  const mogoUrl = `${process.env.MONGODB_URI}/${process.env.db}`;
  const client = new MongoClient(mogoUrl);
  try {
    await client.connect();
    const db = client.db(process.env.db);
    const collection = db.collection(process.env.col);



    const data = await collection.find({}).toArray();
    const cacheControl = "no-cache";  
    return NextResponse.json(data, { status: 200, headers: { "Cache-Control": cacheControl } });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred", details: error.message },
      { status: 500 },
    );
  } finally {
    client.close();
  }
}
export const revalidate = 0;