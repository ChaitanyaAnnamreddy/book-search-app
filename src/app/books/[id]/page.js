"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, CircularProgress, Box, Container } from "@mui/material";
import { Card, Image, Tooltip, Avatar } from "antd";
import { fetchBookById } from "../../../lib/bookService";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const { Meta } = Card;

export default function BookDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  Retrieves the book ID from the URL parameters
  Stores the fetched book details
  Tracks loading state
  */

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

  // Show loading indicator while fetching data
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  // Display message if book is not found
  if (!book) return <Typography variant="h5">Book not found</Typography>;

  // Generates star ratings based on book's rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? <StarIcon key={i} /> : <StarBorderIcon key={i} />
    );
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => router.push("/")}
          startIcon={<ArrowBackIcon />}
        >
          Back to Home
        </Button>

        <Card
          hoverable
          style={{ width: 350, margin: "50px 20px", textAlign: "center" }}
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
            <Meta title={book.title} sx={{ m: 1 }} />
          </Tooltip>

          <Meta description={book.author} />
          <Box display="flex" justifyContent="center" alignItems="center" m={1}>
            {renderStars(book.rating)}
          </Box>
          <Tooltip title={book.synopsis}>
            <Meta
              description={
                <div
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {book.synopsis}
                </div>
              }
            />
          </Tooltip>
        </Card>
      </Box>
    </Container>
  );
}
