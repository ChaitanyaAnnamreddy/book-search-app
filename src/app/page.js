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
import { useTheme } from "@mui/material/styles";
import { fetchBooks } from "../lib/bookService";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

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
  const theme = useTheme();

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        const books = await fetchBooks();
        if (books) {
          setAllBooks(books);
          setFilteredBooks(books);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to fetch books");
      }
      setLoading(false);
    };

    fetchBookData();
  }, []); 

  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredBooks(allBooks);
      setPage(0);
      return;
    }
    const filtered = allBooks.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
    setPage(0);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    if (!event.target.value.trim()) {
      setFilteredBooks(allBooks);
      setPage(0);
    }
  };

  const handleClear = () => {
    setQuery("");
    setFilteredBooks(allBooks);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedBooks = [...filteredBooks].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredBooks(sortedBooks);
  };

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
          onClick={() => router.push("/add-book")}
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
                      router.push(`/book/${encodeURIComponent(book.id)}`)
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
