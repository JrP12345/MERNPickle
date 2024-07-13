// CartItem.js
import React, { useState, useEffect } from "react";
import "../styles/CartItem.css";

const CartItem = ({ item, fetchProduct, removeFromCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!item || !item.productId) {
          throw new Error("Invalid item data");
        }

        const fetchedProduct = await fetchProduct(item.productId);
        setProduct(fetchedProduct.product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [item, fetchProduct]);

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (!product) {
    return <p>Error loading product details</p>; // Handle gracefully
  }
  const handleIncrement = async () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch("http://localhost:4000/cart/cartAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          productId: item.productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleDecrement = async () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      // Send a request to update the quantity in the backend
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          "http://localhost:4000/cart/decrementCart",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: JSON.stringify({ productId: item.productId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update cart");
        }
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };
  return (
    <div className="cartitemcontainer">
      <div className="cartimagecontainer">
        <img
          src={`http://localhost:4000/${product.image}`}
          alt={product.name}
          className="cartimage"
        />
      </div>
      <div className="cartnameweightcontainer">
        <h3 className="nameprice">{product.name}</h3>
        <h6 className="cartweight">{product.weight}</h6>
      </div>
      <div className="quanrem">
        <div className="cartitemquanity">
          <div className="minplusconcart" onClick={handleDecrement}>
            <i className="fa-solid fa-minus"></i>
          </div>
          <div className="containerqauntityitem">{quantity}</div>
          <div className="minplusconcart" onClick={handleIncrement}>
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>
        <div className="cartpriceremovecontainer">
          <h3 className="nameprice">{product.price}/-</h3>
          <button
            className="cartrmovebtn"
            onClick={() => removeFromCart(item.productId)}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="totalcon">{product.price * quantity}/-</div>
    </div>
  );
};

export default CartItem;
