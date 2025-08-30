import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('q');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    const param = searchType === 'q' ? 'q' : searchType;
    const url = `https://openlibrary.org/search.json?${param}=${encodeURIComponent(searchTerm)}&limit=20`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Book Finder for Alex</h1>
        <p className="header-subtitle">Hey Alex! Discover books for your studies, research, or just for fun. Search by title, author, subject, ISBN, or anything else!</p>
      </header>
      
      <div className="search-form">
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)}
          className="search-select"
        >
          <option value="q">All Fields</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="subject">Subject</option>
          <option value="isbn">ISBN</option>
        </select>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search for books..." 
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      ) : (
        <ul className="book-list">
          {books.length > 0 ? (
            books.map((book, index) => (
              <li key={index} className="book-item">
                {book.cover_i ? (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                    alt={`${book.title} cover`} 
                    className="book-cover"
                  />
                ) : (
                  <div className="no-cover">
                    <span>No Cover</span>
                  </div>
                )}
                <div className="book-details">
                  <h2 className="book-title">{book.title}</h2>
                  <p className="book-author">By {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
                  <p className="book-year">Published: {book.first_publish_year || 'N/A'}</p>
                  <p className="book-subjects">Subjects: {book.subject ? book.subject.slice(0, 5).join(', ') : 'N/A'}</p>
                  <p className="book-isbn">ISBN: {book.isbn ? book.isbn[0] : 'N/A'}</p>
                  <a 
                    href={`https://openlibrary.org${book.key}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="book-link"
                  >
                    Explore on Open Library
                  </a>
                </div>
              </li>
            ))
          ) : (
            <p className="no-results">No books found. Try another search!</p>
          )}
        </ul>
      )}
      <footer className="app-footer">
        <p>Built for Alex | Powered by <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer">Open Library</a></p>
      </footer>
    </div>
  );
}

export default App;