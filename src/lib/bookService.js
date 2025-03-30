export const fetchBookById = async (id) => {
  try {
    const res = await fetch(`/api/books?query=${id}`, {
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
