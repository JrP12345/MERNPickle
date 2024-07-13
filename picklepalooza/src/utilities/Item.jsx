import React from "react";
import "../styles/Item.css";

const Item = ({ product }) => {
  if (!product || !product.image) {
    return null; // If product or product image is undefined, return null to avoid errors
  }
  const addToCart = async (e, productId) => {
    e.preventDefault(); // Prevent the default behavior of the button
    e.stopPropagation(); // Stop the event from propagating to parent elements
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch("https://mernpickle-backend.onrender.com/cart/cartAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming you have a token for authentication
        },
        body: JSON.stringify({ productId, quantity: 1 }), // Sending productId in the request body

        credentials: "include",
      });

      if (response.ok) {
        // Handle successful response from the backend
        const data = await response.json();
        console.log("Product added to cart successfully:", data);
      } else {
        // Handle errors from the backend
        const errorData = await response.json();
        console.error("Failed to add product to cart:", errorData);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("An error occurred while adding product to cart:", error);
    }
  };

  return (
    <div className="itemcontainer">
      <div className="itemimagecontainer">
        <img
          src={`https://mernpickle-backend.onrender.com/${product.image}`}
          alt={product.name}
          className="productimg"
        />
      </div>
      <div className="itemtitlecontainer">
        <h3 className="prdttxt">{product.name}</h3>
      </div>
      <div className="pricecontainer">
        <h3 className="prdttxt">{product.price}</h3>
      </div>
      <button
        className="prdtadcartbtn"
        onClick={(event) => addToCart(event, product._id)}
      >
        Add To Cart
      </button>
    </div>
  );
};

export default Item;
