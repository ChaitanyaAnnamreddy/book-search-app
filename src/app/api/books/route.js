import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/books.json");

export async function GET(req) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const books = JSON.parse(fileContents);
    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load books" },
      { status: 500 }
    );
  }
}
