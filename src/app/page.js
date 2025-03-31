"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchOff, Close as CloseIcon } from "@mui/icons-material";
import {
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  Box,
  Skeleton,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { fetchBooks } from "../lib/bookService";
import TablePaginationActions from "../app/components/TablePaginationActions";

// Main component for the Book Search Application
export default function Home() {
  const [query, setQuery] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const router = useRouter();

  // Fetches book data when the component mounts
  useEffect(() => {
    // Async function to fetch books from the bookService
    const fetchBookData = async () => {
      setLoading(true); // Sets loading state to true while fetching
      try {
        const books = await fetchBooks(); // Calls external service to get book data
        if (books) {
          setAllBooks(books); // Stores all books in state
          setFilteredBooks(books); // Initializes filtered books with all books
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to fetch books"); // Sets error message if fetch fails
      }
      setLoading(false); // Sets loading state to false after fetch completes
    };

    fetchBookData(); // Invokes the fetch function
  }, []); // Empty dependency array ensures this runs only on mount

  // Filters books based on the search query
  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredBooks(allBooks); // Resets to all books if query is empty
      setPage(0); // Resets pagination to the first page
      return;
    }
    const filtered = allBooks.filter(
      (book) => book.title.toLowerCase().includes(query.toLowerCase()) // Case-insensitive title search
    );
    setFilteredBooks(filtered); // Updates filtered books state
    setPage(0); // Resets pagination to the first page
  };

  // Triggers search when the Enter key is pressed
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Calls the search function
    }
  };

  // Updates the query state as the user types
  const handleChange = (event) => {
    setQuery(event.target.value); // Updates query state with input value
    if (!event.target.value.trim()) {
      setFilteredBooks(allBooks); // Resets to all books if input is cleared
      setPage(0); // Resets pagination to the first page
    }
  };

  // Clears the search query and resets the book list
  const handleClear = () => {
    setQuery(""); // Clears the query input
    setFilteredBooks(allBooks); // Resets filtered books to all books
    setPage(0); // Resets pagination to the first page
  };

  // Changes the current page in the pagination
  const handlePageChange = (_, newPage) => {
    setPage(newPage); // Updates the page state to the new page number
  };

  // Updates the number of rows per page and resets to the first page
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Updates rows per page
    setPage(0); // Resets pagination to the first page
  };

  // Sorts the book list based on the selected column (title, author, rating)
  const handleSort = (key) => {
    let direction = "asc"; // Default sort direction is ascending
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"; // Toggles to descending if already ascending
    }
    setSortConfig({ key, direction }); // Updates sort configuration

    const sortedBooks = [...filteredBooks].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1; // Sorts ascending or descending
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1; // Sorts ascending or descending
      }
      return 0; // No change if equal
    });
    setFilteredBooks(sortedBooks); // Updates the filtered books with sorted data
  };

  // Render the UI
  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", py: { xs: 2, md: 3 } }}
      >
        Book Search Application
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            justifyContent: "center",
          }}
        >
          <TextField
            label="Search by title"
            variant="outlined"
            value={query || ""}
            size="small"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            sx={{
              width: {
                xs: "100%",
                sm: "250px",
                md: "400px",
              },
            }}
            InputProps={{
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClear}
                    edge="end"
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            size="small"
            sx={{
              width: { xs: "20%", sm: "auto" },
            }}
          >
            Search
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={() => router.push("/books/add")}
          size="small"
          startIcon={<AddIcon />}
          sx={{ width: { xs: "30%", sm: "auto" } }}
        >
          Add Book
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ width: "50%" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <strong>Title</strong>
                  <IconButton onClick={() => handleSort("title")} size="small">
                    {sortConfig.key === "title" &&
                    sortConfig.direction === "asc" ? (
                      <ArrowUpwardOutlined fontSize="inherit" />
                    ) : (
                      <ArrowDownwardOutlined fontSize="inherit" />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <strong>Author</strong>
                  <IconButton onClick={() => handleSort("author")} size="small">
                    {sortConfig.key === "author" &&
                    sortConfig.direction === "asc" ? (
                      <ArrowUpwardOutlined fontSize="inherit" />
                    ) : (
                      <ArrowDownwardOutlined fontSize="inherit" />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <strong>Rating</strong>
                  <IconButton onClick={() => handleSort("rating")} size="small">
                    {sortConfig.key === "rating" &&
                    sortConfig.direction === "asc" ? (
                      <ArrowUpwardOutlined fontSize="inherit" />
                    ) : (
                      <ArrowDownwardOutlined fontSize="inherit" />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredBooks.length > 0 ? (
              filteredBooks
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((book) => (
                  <TableRow
                    key={book.id}
                    hover
                    onClick={() =>
                      router.push(`/books/${encodeURIComponent(book.id)}`)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.rating}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow sx={{ height: "50vh" }}>
                <TableCell colSpan={3} align="center">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <SearchOff sx={{ fontSize: 60, color: "grey.500" }} />
                    <Typography variant="h6" color="textSecondary">
                      No books found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                count={filteredBooks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 50]}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
}
