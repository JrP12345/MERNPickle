import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/ProducDetails.css";
import UserReviewItem from "./UserReviewItem";
import Userreviewform from "./Userreviewform";
import Item from "./Item";
function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  // Extract productId from URL using useParams
  const { productId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/product/${productId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setProduct(data.product); // Assuming the product is under 'product' key
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/review/list/${productId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const result = await response.json();

        if (result.success) {
          const reversedReviews = result.reviews.reverse().slice(0, 4);
          setReviews(reversedReviews);
        } else {
          console.error("Failed to fetch reviews:", result.message);
        }
      } catch (error) {
        console.error("Fetch Reviews Error:", error);
      }
    };

    fetchReviews();
  }, [productId]);
  const addToCartWithQuantity = async (e, productId, quantity) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Adding to cart:", { productId, quantity });
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch("http://localhost:4000/cart/cartAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: parseInt(quantity, 10) }), // Quantity specified
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Product added to cart successfully:", data);
      } else {
        const errorData = await response.json();
        console.error("Failed to add product to cart:", errorData);
      }
    } catch (error) {
      console.error("An error occurred while adding product to cart:", error);
    }
  };

  useEffect(() => {
    // Fetch trending products (latest four products)
    async function fetchTrendingProducts() {
      try {
        const response = await fetch("http://localhost:4000/product/list");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Sort products based on creation date in descending order
        const sortedProducts = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        // Set the latest four products as trending products
        setTrendingProducts(sortedProducts.slice(0, 3));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchTrendingProducts();
  }, []);

  const formactivate = () => {
    return setReview(true);
  };
  const formdeactivate = () => {
    return setReview(false);
  };
  const increaseQuantity = () =>
    setQuantity((prevQuantity) => prevQuantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const productBuy = () => {
    navigate("/buy", {
      state: {
        products: [
          {
            productId: product._id,
            name: product.name,
            image: product.image,
            weight: product.weight,
            price: product.price,
            quantity,
          },
        ],
      },
    });
  };
  return (
    <div className="detailpageproductcontainer">
      {loading ? (
        <p>Loading...</p>
      ) : product ? (
        <div className="detailcontainer">
          <div className="topcontainer">
            <div className="leftcontainer">
              <div className="imagecontaierdeatil">
                <img
                  src={`http://localhost:4000/${product.image}`}
                  className="detailimg"
                  alt="Product"
                />
              </div>
            </div>
            <div className="rightdeatilproductconatiner">
              <div className="namedetailcon">{product.name}</div>

              <p className="smalldtl">
                Manufacturing Date:{" "}
                {new Date(product.manufacturingDate).toLocaleDateString()}
              </p>
              <p className="smalldtl">
                Expiry Date: {new Date(product.expiryDate).toLocaleDateString()}
              </p>
              <p className="smalldtl">Spice Level: {product.spiceLevel}</p>
              <p className="smalldtl">
                Country of Origin: {product.countryOrigin}
              </p>

              <div className="weightdetailcon">{product.weight} grams</div>
              <div className="quntotalprice">
                <div className="pricedetailcon">Rs. {product.price}.00 </div>
                <div className="quanitycondetailproduct">
                  <p className="qanupdown" onClick={increaseQuantity}>
                    <i className="fa-solid fa-plus"></i>
                  </p>
                  <p className="quantityproduct">{quantity}</p>
                  <p className="qanupdown" onClick={decreaseQuantity}>
                    <i className="fa-solid fa-minus"></i>
                  </p>
                </div>
              </div>
              <div className="addbuybtncon">
                <button
                  className="prdtadcartbtn"
                  onClick={(event) =>
                    addToCartWithQuantity(event, product._id, quantity)
                  }
                >
                  Add To Cart
                </button>
                <button className="butprdtbtn" onClick={productBuy}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>{" "}
          <div className="btndeatilproductcon">
            <div className="btndtltxt">
              <p>
                <b>Description: </b>
                {product.description}
              </p>
            </div>
            <p className="btndtltxt">
              <b>Ingredients: </b>
              {product.ingredients}
            </p>
            <p className="btndtltxt">
              <b>Pickle Method: </b>
              {product.pickleMethod}
            </p>
          </div>
          <div className="reviewsection">
            <div className="reviewtitlesection">
              <h3 className="reviewtitle">REVIEW</h3>
            </div>
            <div className="top4reviewsection">
              {reviews.map((review) => (
                <UserReviewItem
                  key={review._id}
                  review={review.review}
                  rating={review.rating}
                  username={review.userId.username}
                  createdAt={review.createdAt}
                />
              ))}
            </div>
            <div className="reviewsubmitconatiner">
              {reviewForm ? (
                <div>
                  <Userreviewform />
                  <button onClick={formdeactivate} className="reviewuserbtn">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={formactivate} className="reviewuserbtn">
                  Write Review
                </button>
              )}
            </div>
          </div>
          <div className="relatedproductsection">
            <div className="reviewtitlesection">
              <h3 className="reviewtitle">You Might Also Like</h3>
            </div>

            <div className="relatedproductcontainer">
              {trendingProducts.map((product) => (
                <Link
                  key={product._id}
                  className="custom-link"
                  to={`/product/${product._id}`}
                >
                  <Item product={product} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
}

export default ProductDetail;
