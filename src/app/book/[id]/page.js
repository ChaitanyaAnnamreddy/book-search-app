"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, CircularProgress } from "@mui/material";
import { Card, Image, Tooltip, Skeleton } from "antd";
import { fetchBookById } from "../../../lib/bookService";

const { Meta } = Card;

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      if (id) {
        setLoading(true);
        const fetchedBook = await fetchBookById(id);
        setBook(fetchedBook);
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!book) return <Typography variant="h5">Book not found</Typography>;

  return (
    <Card
      hoverable
      style={{ width: 300, margin: "100px auto", textAlign: "center" }}
      cover={<Image alt={book.title} src={book.image} preview={false} />}
    >
      <Tooltip title={book.title}>
        <Meta title={book.title} />
      </Tooltip>
      <Meta description={book.author} />
    </Card>
  );
}
