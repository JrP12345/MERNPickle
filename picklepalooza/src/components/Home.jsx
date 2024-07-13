import React, { useState, useEffect } from 'react';
import Slider from "../utilities/Slider";
import "../styles/Home.css";
import Item from '../utilities/Item';
import BlogItem from '../utilities/BlogItem';
import { Link } from 'react-router-dom';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [uniqueProducts, setUniqueProducts] = useState([]);
  useEffect(() => {
    // Fetch all blogs
    async function fetchBlogs() {
      try {
        const response = await fetch('https://mernpickle-admin-backend.onrender.com/blog/list');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
  
        // Get 4 random blogs from the fetched data
        const randomBlogs = getRandomBlogs(data.data, 4);
        setBlogs(randomBlogs); // Update blogs state with fetched data
  
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    }
  
    fetchBlogs();
  }, []);
  
  // Function to get n random blogs from an array of blogs
  function getRandomBlogs(blogs, n) {
    const shuffled = blogs.sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, n); // Get first n elements
  }
  useEffect(() => {
    // Fetch trending products (latest four products)
    async function fetchTrendingProducts() {
      try {
        const response = await fetch('https://mernpickle-backend.onrender.com/product/list');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Sort products based on creation date in descending order
        const sortedProducts = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Set the latest four products as trending products
        setTrendingProducts(sortedProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    // Fetch unique products (random four products)
    async function fetchUniqueProducts() {
      try {
        const response = await fetch('https://mernpickle-backend.onrender.com/product/list');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Shuffle the products to get a random order
        const shuffledProducts = data.data.sort(() => Math.random() - 0.5);
        // Set the first four shuffled products as unique products
        setUniqueProducts(shuffledProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchTrendingProducts();
    fetchUniqueProducts();
  }, []);

  return (
    <div className='Homecontainer'>
      <Slider />
      <div className="trendingtitle">
        <h1>Trending Products</h1>
      </div>
      <div className="trendingcontainer">
        {trendingProducts.map(product => (
          <Link key={product._id} className="custom-link" to={`/product/${product._id}`}>
          <Item product={product} />
        </Link>
        ))}
      </div>
      <div className="trendingtitle">
        <h1>Unique Products</h1>
      </div>
      <div className="trendingcontainer">
        {uniqueProducts.map(product => (
         <Link key={product._id} className="custom-link" to={`/product/${product._id}`}>
         <Item product={product} />
       </Link>
        ))}
      </div>
      <div className="trendingtitle">
        <h1>Explore Our Blogs</h1>
      </div>
      <div className="trendingcontainer">
      {blogs.map((blog) => (
          <Link key={blog._id} className="custom-link" to={`/blog/${blog._id}`}>
            <BlogItem blog={blog} />
          </Link>
        ))}
      </div>
      <div className="explorebtn">
        <Link to={`/blog`}>
        <button className='explbtn'>Explore More</button>
        </Link >
        
      </div>
    </div>
  );
}

export default Home;
