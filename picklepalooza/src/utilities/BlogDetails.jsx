import React, { useState, useEffect } from "react";
import "../styles/BlogDetail.css";
import { Link, useParams } from "react-router-dom";
import Blogs from "./Blogs";

function BlogDetails() {
  const [blog, setBlog] = useState(null);
   const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { blogId } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4001/blog/${blogId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setBlog(data.blog);
        setLoading(false);
        // Scroll to the top of the page when blogId changes
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [blogId]);
  // Function to format text into paragraphs
  const formatDescriptionIntoParagraphs = () => {
    // Splitting text by new lines (\n) to create paragraphs
    const paragraphs = blog.description
      .split("\n")
      .map((paragraph, index) => <p key={index}>{paragraph}</p>);
    return paragraphs;
  };
  useEffect(() => {
    // Fetch all blogs
    async function fetchBlogs() {
      try {
        const response = await fetch('http://localhost:4001/blog/list');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data.data); // Update blogs state with fetched data
        setLoading(false);
        // Scroll to the top of the page when blogId changes
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    }

    fetchBlogs();
  }, []);
  // Fetch all blogs and filter related blogs based on the category of the current blog
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:4001/blog/list");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        // Filter blogs to get only those in the same category as the current blog
        const relatedBlogs = data.data.filter(
          (b) => b.category === blog?.category && b._id !== blogId
        );
        // Shuffle the array to get random blogs
        const shuffledBlogs = shuffleArray(relatedBlogs).slice(0, 3);
        setBlogs(shuffledBlogs); // Update blogs state with filtered and shuffled data
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [blog, blogId]);
  // Function to shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!blog) {
    return <p>Blog not found.</p>;
  }
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };
  
  return (
    <div className="blogconatinermain">
      <div className="mainblogdetailcon">
        <h3 className="blogtitledetail">{blog.title}</h3>
        <div className="blogauthdateconatiner">
          <h3 className="blogtxtdateauth">{blog.author}</h3>
          <h3 className="blogtxtdateauth">{formatDate(blog.blogdate)}</h3>
        </div>
        <div className="blogdetailimagecontainer">
          <img
            src={`http://localhost:4001/${blog.image}`}
            alt={blog.name}
            className="blogimagedetail"
          />
        </div>
        <div className="descriptionblog">
          <h2 className="descblogtxt">
            {" "}
            {loading ? <p>Loading...</p> : formatDescriptionIntoParagraphs()}
          </h2>
        </div>
        <div className="relatedblogsconatiner">
        
          <div className="reviewtitlesection">
              <h3 className="reviewtitle">You Might Also Like</h3>
            </div>
            
            <div className="relatedproductcontainer">
            {blogs.map((blog) => (
          <Link key={blog._id} className="custom-link" to={`/blog/${blog._id}`}>
            <Blogs blog={blog} />
          </Link>
        ))}
      </div>
           
        
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
