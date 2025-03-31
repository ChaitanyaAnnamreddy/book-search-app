"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Card } from "antd";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { API_BASE_URL, API_ADD_BOOK_URL } from "@/lib/constants";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // State to manage validation errors
  const [errors, setErrors] = useState({
    title: null,
    author: null,
    image: null,
    rating: null,
    synopsis: null,
  });

  const router = useRouter();

  // Fetch existing books from the API
  const fetchBooks = async () => {
    try {
      const res = await fetch(API_BASE_URL, { cache: "no-store" });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data.books;
    } catch (err) {
      console.error("Error fetching books:", err);
      return [];
    }
  };

  // Validate form fields before submission
  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      title: null,
      author: null,
      image: null,
      rating: null,
      synopsis: null,
    };

    if (!title.trim()) {
      newErrors.title = "Title field should not be empty";
      isValid = false;
    }
    if (!author.trim()) {
      newErrors.author = "Author field should not be empty";
      isValid = false;
    }
    if (!rating.trim()) {
      newErrors.rating = "Rating field should not be empty";
      isValid = false;
    }
    if (!synopsis.trim()) {
      newErrors.synopsis = "Synopsis field should not be empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle book submission
  const handleAddBook = async () => {
    if (!validateFields()) {
      setSnackbarMessage("Please fill in all required fields");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Generate a unique ID for the new book
    const books = await fetchBooks();
    const newId =
      books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

    // Send book data to the API
    const res = await fetch(API_ADD_BOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newId,
        title,
        author,
        image,
        rating,
        synopsis,
      }),
    });

    if (res.ok) {
      setSnackbarMessage("Book added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTitle("");
      setAuthor("");
      setImage("");
      setRating("");
      setSynopsis("");
      setErrors({
        title: null,
        author: null,
        image: null,
        rating: null,
        synopsis: null,
      });

      setTimeout(() => router.push("/"), 2000);
    } else {
      setSnackbarMessage("Error adding book");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Close snackbar notification
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Render star icons based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? <StarIcon key={i} /> : <StarBorderIcon key={i} />
      );
    }
    return stars;
  };

  return (
    <>
      {/* Card for adding a book */}
      <Card
        title="Add a Book"
        style={{
          width: "100%",
          margin: "100px auto",
          maxWidth: 800,
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Title input field */}
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.title}
            helperText={errors.title}
          />

          {/* Author input field */}
          <TextField
            label="Author"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.author}
            helperText={errors.author}
          />

          {/* Rating input field with stars */}
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            <TextField
              label="Rating (1-5)"
              fullWidth
              value={rating}
              onChange={(e) => {
                let value = e.target.value;
                if (value === "") {
                  setRating("");
                  return;
                }
                let num = parseFloat(value);
                if (num >= 1 && num <= 5) {
                  setRating(value);
                }
              }}
              error={!!errors.rating}
              helperText={errors.rating}
              type="number"
              inputProps={{ min: 1, max: 5, step: "0.5" }}
            />
            <Box display="flex" ml={2}>
              {renderStars(rating)}
            </Box>
          </Box>

          {/* Image URL input field */}
          <TextField
            label="Image URL"
            fullWidth
            value={image}
            onChange={(e) => setImage(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.image}
            helperText={errors.image}
          />

          {/* Synopsis input field */}
          <TextField
            label="Synopsis"
            fullWidth
            multiline
            rows={3}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.synopsis}
            helperText={errors.synopsis}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => router.push("/")}
              fullWidth={(theme) => ({
                [theme.breakpoints.down("sm")]: true,
                [theme.breakpoints.up("sm")]: false,
              })}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddBook}
              fullWidth={(theme) => ({
                [theme.breakpoints.down("sm")]: true,
                [theme.breakpoints.up("sm")]: false,
              })}
            >
              Add Book
            </Button>
          </Box>
        </Box>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
