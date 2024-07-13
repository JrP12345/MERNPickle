import React from "react";
import "../styles/BlogItem.css";

function BlogItem({ blog }) {
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
    // Function to truncate title to 2 lines (approximate)
    const truncateTitle = (title) => {
      const maxLength = 50; // Adjust this number based on your font size and design
      return truncateText(title, maxLength);
    };

     // Function to format date to "24/7/2024" format
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className="blog-container">
      <div className="blog-image">
      <img src={`http://localhost:4001/${blog.image}`} alt={blog.name} className="blogimage" />
        <div className="blog-title-overlay">
          <h3 className="blog-title">
          {truncateTitle(blog.title)}
          </h3>
          <div className="blog-upload-detail-container">
            <div className="blog-writer-name-date">
              <div className="blog-writer">
                <h2 className="authortxtblog">{blog.author}</h2>
              </div> 
              <div className="blog-date">
              <h4 className="namedatetxt">{formatDate(blog.blogdate)}</h4>
            </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogItem;
