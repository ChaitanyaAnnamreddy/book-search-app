import { API_BASE_URL } from "./constants";

export const fetchBookById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}?query=${id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch book");
    }
    if (data.books && data.books.length > 0) {
      return data.books[id - 1];
    }
    return null;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
};

export const fetchBooks = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}`);
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
