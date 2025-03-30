import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  const { id, title, author, image } = await req.json();

  if (!title || !author) {
    return NextResponse.json(
      { error: "Title and Author are required" },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), "data", "books.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const books = JSON.parse(fileContents);

  books.push({ id, title, author, image });

  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));

  return NextResponse.json(
    { message: "Book added successfully" },
    { status: 201 }
  );
}
