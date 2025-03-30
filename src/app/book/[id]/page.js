"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, CircularProgress, Box } from "@mui/material";
import { Card, Image, Tooltip, Avatar } from "antd";
import { fetchBookById } from "../../../lib/bookService";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? <StarIcon key={i} /> : <StarBorderIcon key={i} />
    );
  };

  return (
    <Card
      hoverable
      style={{ width: 300, margin: "70px auto", textAlign: "center" }}
      cover={
        book.image ? (
          <Image alt={book.title} src={book.image} preview={false} />
        ) : (
          <Avatar
            size={300}
            style={{
              backgroundColor: "#1890ff",
              fontSize: "48px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {book.title.charAt(0).toUpperCase()}
          </Avatar>
        )
      }
    >
      <Tooltip title={book.title}>
        <Meta title={book.title} sx={{ m: 1 }}/>
      </Tooltip>
      <Meta description={book.author} />
      <Box display="flex" justifyContent="center" alignItems="center" m={1}>
        {renderStars(book.rating)}
      </Box>
      <Meta description={book.synopsis} />
    </Card>
  );
}
