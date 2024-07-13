// Cart.js
import React, { useState, useEffect } from "react";
import "../styles/Cart.css";
import CartItem from "../utilities/CartItem";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
const Cart = ({ onCloseModal }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await fetch('https://mernpickle-backend.onrender.com/cart/cartItems', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data = await response.json();

        setCartItems(data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }finally {
        
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);
  useEffect(() => {
    if (!loading && cartItems.length > 0) {
      const calculateTotalPrice = async () => {
        try {
          let total = 0;
  
          for (const item of cartItems) {
            // Fetch product details for the current item
            const product = await fetchProduct(item.productId);
            if (!product || !product.product || !product.product.price) {
              throw new Error("Invalid product details or missing price");
            }
            // Calculate subtotal for the current item
            const subtotal = parseFloat(product.product.price) * parseInt(item.quantity);
            // Add subtotal to the total price
            total += subtotal;
          }
          // Set the calculated total price directly
          setTotalPrice(total.toFixed(2)); // Fixing to 2 decimal places
        } catch (error) {
          console.error("Error calculating total price:", error);
          // Reset total price to 0 in case of error
          setTotalPrice(0);
        }
      };
      calculateTotalPrice();
    } else {
      // If cart is empty, set total price to 0
      setTotalPrice(0);
    }
  }, [cartItems, loading]);
  
  
  
  
  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(
        `https://mernpickle-backend.onrender.com/product/${productId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }finally {
        
      setLoading(false);
    }
  };
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('Token');
      const response = await fetch('https://mernpickle-backend.onrender.com/cart/removeCart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ productId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove product from cart');
      }
      
      // Update cartItems state by filtering out the removed product
      setCartItems(prevCartItems => prevCartItems.filter(item => item.productId !== productId));

    } catch (error) {
      console.error('Error removing product from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeAllFromCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('Token');
      const response = await fetch('https://mernpickle-backend.onrender.com/cart/removeCartAll', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove all products from cart');
      }

      // Clear cartItems state to remove all items from the cart
      setCartItems([]);

    } catch (error) {
      console.error('Error removing all products from cart:', error);
    } finally {
      setLoading(false);
    }
  };
  const checkOut = async () => {
    try {
      const productsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const productDetails = await fetchProduct(item.productId);
          return {
            productId: item.productId,
            name: productDetails.product.name,
            image: productDetails.product.image,
            price: productDetails.product.price,
            quantity: item.quantity,
            weight:productDetails.product.weight,
            fromCart: true,
          };
        })
      );
      
      navigate("/buy", {
        state: {
          products: productsWithDetails,
          fromCart: true,
        }
      });
    } catch (error) {
      console.error("Error preparing checkout:", error);
    }
  };
  return (
    <div className="cartcontainer">
      <div className="carttitle">
        <h3>Shopping Cart</h3>
        <button className='cartrmovebtnall' onClick={removeAllFromCart}>Remove All</button>
      </div>
      <div className="cartitemcon">
        
        {loading ? (
            <div className="spinner-container">
              <Oval color="#00BFFF" height={80} width={80} />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="no-products">
              No products found.
            </div>
          ) : (
            cartItems.map((item, index) => (
              <CartItem key={index} item={item} fetchProduct={fetchProduct} removeFromCart={removeFromCart} />
            ))
          )}
      </div>
      <div className="carttotalconatiner">
        <h3>Total</h3>
        <h3>{totalPrice}/-</h3>
        <button className='checkoutbtn'  onClick={() => {
          checkOut();
          onCloseModal(); // Close the modal after checkout
        }} >Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
