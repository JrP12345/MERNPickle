import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import Cart from "./Cart";
function Navbar({ isLoggedIn, updateLoggedInState }) {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();
  let intervalId = null; // Variable to hold the interval ID

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch initial cart items count when user logs in or component mounts
      fetchCartItemsCount();

      // Start polling to fetch cart items count every second
      intervalId = setInterval(() => {
        fetchCartItemsCount();
      }, 500);
    } else {
      // Clear interval and reset cart items count when user logs out
      clearInterval(intervalId);
      setCartItemsCount(0);
    }

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount or logout
    };
  }, [isLoggedIn]); // Run effect when isLoggedIn changes
  useEffect(() => {
    // Update isLoggedIn state from local storage
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      updateLoggedInState(true);
      fetchUsername();
    }
  }, [updateLoggedInState]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    const navContainer = document.querySelector(".nav-container");
    if (navContainer) {
      navContainer.classList.toggle("hidden");
    }
  };
  // Toggle the visibility of the modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/logout", {
        method: "DELETE",
        credentials: "include", // Ensure credentials are sent with the request (cookies)
      });

      if (response.ok) {
        // Perform any additional client-side cleanup or redirection if needed
        console.log("Logout successful");
        // Clear local storage and update state
        localStorage.removeItem("isLoggedIn");
        updateLoggedInState(false);
        navigate("/login");
        clearInterval(intervalId); // Stop polling after logout
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/userprofile", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Check if user data exists in the response
        if (data.user && data.user.username) {
          setUsername(data.user.username);
        } else {
          console.error("Username not found in response data");
        }
      } else {
        console.error("Failed to fetch username");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };
  // Function to fetch cart items count
  const fetchCartItemsCount = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch("http://localhost:4000/cart/cartItems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Calculate the number of unique items in the cart
        const uniqueItems = new Set(
          data.products.map((item) => item.productId)
        );
        const uniqueItemCount = uniqueItems.size;
        setCartItemsCount(uniqueItemCount);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  return (
    <div className="navbar">
      <div
        className={`menu-icon ${showMenu ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <i className="fa-solid fa-bars"></i>
      </div>
      <div className="nav-container">
        <div className="logo">
          <img src="/loogo.jpg" className="logo-img" alt="Pickle Palooza" />
        </div>
        <div className={`nav-item-container ${showMenu ? "hidden" : ""}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/store" className="nav-link">
            Store
          </Link>
          <Link to="/blog" className="nav-link">
            Blog
          </Link>
          <Link to="/contactus" className="nav-link">
            Contact Us
          </Link>
          <Link to="/aboutus" className="nav-link">
            About Us
          </Link>
        </div>
        {isLoggedIn ? (
          <div className={`nav-reglog-container ${showMenu ? "hidden" : ""}`}>
            <div className="userlogout-container">
              <div className="usernamecon">{username}</div>
              <i
                className="fa-solid fa-right-from-bracket"
                onClick={handleLogout}
              ></i>
            </div>
          </div>
        ) : (
          <div className={`nav-reglog-container ${showMenu ? "hidden" : ""}`}>
            <Link to="/register" className="nav-link">
              Register
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </div>
        )}
        <div className="likecart">
          {/* <div className="like-container">
            <div className="likecartbtn">
              <i className="fa-solid fa-heart" />
            </div>
          </div> */}
          <div className="cart-container" onClick={toggleModal}>
            <div className="likecartbtn">
              <i className="fa-solid fa-cart-shopping" />
              {cartItemsCount > 0 && (
                <div className="cart-quantity-badge">{cartItemsCount}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="cart-modal-container">
          <div className="cart-modal">
            <div className="cart-content">
              {/* Modal content */}
              <button className="close-btn" onClick={toggleModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <Cart onCloseModal={toggleModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
