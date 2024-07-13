import React,{useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Store from "./components/Store";
import Blog from "./components/Blog";
import AboutUs from "./components/AboutUs"
import ContactUs from "./components/ContactUs"
import Footer from "./components/Footer";
import ProductDetail from "./utilities/ProductDetail"
import BlogDetails from "./utilities/BlogDetails"
import ProductBuy from "./utilities/ProductBuy";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage for login status on initial load
    const storedLoggedInStatus = localStorage.getItem("isLoggedIn");
    if (storedLoggedInStatus) {
      setIsLoggedIn(JSON.parse(storedLoggedInStatus));
    }
  }, []);

  const updateLoggedInState = (loggedIn) => {
    setIsLoggedIn(loggedIn);
    // Store login status in localStorage
    localStorage.setItem("isLoggedIn", loggedIn);
  };
  return (
    <Router>
  
  <Navbar isLoggedIn={isLoggedIn} updateLoggedInState={updateLoggedInState} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login updateLoggedInState={updateLoggedInState} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store" element={<Store />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/product/:productId" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <ProductDetail />
          </ProtectedRoute>
        } />
         <Route path="/blog/:blogId" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <BlogDetails />
          </ProtectedRoute>
        } />
        <Route path="/buy" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <ProductBuy />
          </ProtectedRoute>
        } />
      </Routes>
<Footer/>
    </Router>
  );
}

export default App;
