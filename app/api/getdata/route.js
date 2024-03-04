import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request, query) {
  const searchParams = new URL(request.url).searchParams;

  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const dateRange = searchParams.get('dateRange');
  const maxGuestsString = searchParams.get('maxGuests');

  const mongoUrl = `${process.env.MONGODB_URI}/${process.env.db}`;
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db(process.env.db);
    const collection = db.collection(process.env.col);

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (subCategory) {
      filter.subCategory = subCategory;
    }

    if (maxGuestsString) {
      filter.maxGuests = { $lte: parseInt(maxGuestsString) };
    }

    if (dateRange) {
      const [startDate, endDate] = dateRange.split(",");
      filter.startDate = { $gte: new Date(startDate) };
      filter.endDate = { $lte: new Date(endDate) };
    }

    const data = await collection.find(filter).toArray();
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
