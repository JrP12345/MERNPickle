import React from 'react'
import "../styles/Blogs.css"

function Blogs({ blog }) {
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
    // Function to truncate title to 2 lines (approximate)
    const truncateTitle = (title) => {
      const maxLength = 40; // Adjust this number based on your font size and design
      return truncateText(title, maxLength);
    };
    const formatDate = (dateString) => {
      const options = { day: "numeric", month: "numeric", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", options);
    };
  return (
    <div className="blogitemcontainer">
        <div className="blogimagecontainer">
        <img src={`http://localhost:4001/${blog.image}`} alt={blog.name} className="blogimage" />
        </div>
        <div className="detailblogcon">
        <div className="blogtitlecontainer">
            <h4 className='blogtitle'>{truncateTitle(blog.title)}</h4>
        </div>
        <div className="blogdesccontainer">
            <h4 className='blogdesc'>{truncateText(blog.description, 150)}</h4>
        </div>
        <div className="blog-upload-detail-container-blog">
            <div className="blog-writer-name-date">
              <div className="blog-writer">
                <h2 className="namedatetxtblog">{blog.author}</h2>
              </div> 
              <div className="blog-date">
              <h4 className="namedatetxtblog">{formatDate(blog.blogdate)}</h4>
            </div>
            </div>
           
          </div>
        </div>
       
    </div>
  )
}

export default Blogs