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

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [errors, setErrors] = useState({ title: "", author: "", image: "" });
  const router = useRouter();

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
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

  const validateFields = () => {
    let isValid = true;
    const newErrors = { title: "", author: "", image: "" };

    if (!title.trim()) {
      newErrors.title = "Title field should not be empty";
      isValid = false;
    }
    if (!author.trim()) {
      newErrors.author = "Author field should not be empty";
      isValid = false;
    }
    if (!image.trim()) {
      newErrors.image = "Image URL field should not be empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddBook = async () => {
    if (!validateFields()) {
      setSnackbarMessage("Please fill in all required fields");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    const books = await fetchBooks();
    const newId =
      books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

    const res = await fetch("/api/add-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: newId, title, author, image }),
    });

    if (res.ok) {
      setSnackbarMessage("Book added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTitle("");
      setAuthor("");
      setImage("");
      setErrors({ title: "", author: "", image: "" });
    } else {
      setSnackbarMessage("Error adding book");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Card
        title="Add a Book"
        style={{
          width: "100%",
          margin: "100px auto",
          maxWidth: 800, // Optional: cap width on large screens
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Author"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.author}
            helperText={errors.author}
          />
          <TextField
            label="Image URL"
            fullWidth
            value={image}
            onChange={(e) => setImage(e.target.value)}
            sx={{ mb: 2 }}
            error={!!errors.image}
            helperText={errors.image}
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
