import React, { useEffect, useState } from "react";
import Blogs from "../utilities/Blogs";
import "../styles/BlogContainer.css";
import { Link } from "react-router-dom";
import { Oval } from 'react-loader-spinner';
function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch all blogs
    async function fetchBlogs() {
      try {
        const response = await fetch("https://mernpickle-admin-backend.onrender.com/blog/list");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.data); // Update blogs state with fetched data
        setFilteredBlogs(data.data); // Initially set filteredBlogs with all blogs
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }finally {
        
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    filterblog(searchTerm);
  };

  const filterblog = (term) => {
    const filteredBlogs = blogs.filter((blogs) =>
      blogs.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBlogs(filteredBlogs);
  };

  return (
    <div className="blogcontainerbox">
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="blogitemsconatiner">
        {loading ? (
            <div className="spinner-container">
              <Oval color="#00BFFF" height={80} width={80} />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="no-products">
              No products found.
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <Link key={blog._id} className="custom-link" to={`/blog/${blog._id}`}>
                <Blogs blog={blog} />
              </Link>
            ))
          )}
       
      </div>
    </div>
  );
}

export default Blog;
