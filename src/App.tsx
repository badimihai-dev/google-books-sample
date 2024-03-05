import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const getSearchUrl = (query?: string) =>
  `https://www.googleapis.com/books/v1/volumes${
    query?.length ? `?q=${query}` : ""
  }`;

const cleanQuery = (query: string) =>
  query
    .split(" ")
    .map((q) => q.trim())
    .filter((q) => q.length)
    .join("+");

const fetchBooks = async (query: string) => {
  if (!query.length) return [];
  const response = await fetch(getSearchUrl(cleanQuery(query)));
  const data = await response.json();
  return data;
};

let timeout: any;
function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      setLoading(true);
      const data = await fetchBooks(query);
      setBooks(data.items);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [query]);

  console.log(books);
  return (
    <>
      <h1>Google Books API - Sample</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
      />
      <div>
        {loading && <h2>Loading...</h2>}
        {!loading && !books && (
          <div>
            <h2 style={{ marginBottom: "8px" }}>Oops, no books found</h2>
            <p style={{ marginTop: "8px" }}>
              Try searching for something else, or check your internet
              connection
            </p>
          </div>
        )}
        {!loading &&
          books?.map((book, index) => (
            <>
              <div key={book.id} className="book-card">
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title}
                  className="book-image"
                />
                <div className="book-content">
                  <div>
                    <h2>{book.volumeInfo.title}</h2>
                    <p>By {[book.volumeInfo?.authors].flat().join(", ")}</p>
                    <p>Published on {book.volumeInfo?.publishedDate}</p>
                    {book.volumeInfo?.categories?.map((category: string) => (
                      <span key={category} className="category">
                        #{category}
                      </span>
                    ))}
                  </div>
                  <p>{book.volumeInfo.description}</p>
                  <a href={book.volumeInfo.previewLink} target="_blank">
                    Preview
                  </a>
                </div>
              </div>
              {index !== books.length - 1 && <hr />}
            </>
          ))}
      </div>
    </>
  );
}

export default App;
