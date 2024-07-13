import React, { useEffect, useState } from "react";
import "../styles/ProductBuy.css";
import FloatingOrderSummary from "./FloatingOrderSummary";
import AddressForm from "./AddressForm";
import { Link, useLocation, useNavigate } from "react-router-dom";

function ProductBuy() {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, fromCart } = location.state || { products: [], fromCart };
  const [selectedAddress, setSelectedAddress] = useState(null);
  // formaddress
  const [addressFormVisible, setAddressFormVisible] = useState(false);
  // array of all list for user
  const [addresses, setAddresses] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFromCart, setIsFromCart] = useState(fromCart);
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("http://localhost:4000/address/list", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request for authentication
        });
        const result = await response.json();
        if (result.success) {
          setAddresses(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);
  // Update selectedAddress when addresses or currentStep changes
  useEffect(() => {
    // Check if selectedAddress is already set and still exists in addresses
    if (selectedAddress && addresses.length > 0) {
      const addressExists = addresses.some(
        (address) => address._id === selectedAddress
      );
      if (!addressExists) {
        setSelectedAddress(null); // Clear selectedAddress if it no longer exists in addresses
      }
    }
  }, [addresses, currentStep]);
  const addNewAddress = () => {
    setAddressFormVisible(true);
  };

  const deactivateForm = () => {
    setAddressFormVisible(false);
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };
  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };
  const calculateTotalCost = () => {
    return products.reduce((total, product) => {
      if (
        product &&
        typeof product.price === "number" &&
        typeof product.quantity === "number"
      ) {
        const productCost = product.price * product.quantity;
        return total + productCost;
      } else {
        console.warn(`Invalid product data for ${product?.productId}`);
        return total;
      }
    }, 0);
  };
  const handleConfirmOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      setError("Please select address and payment method.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/order/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request for authentication
        body: JSON.stringify({
          products,
          addressId: selectedAddress,
          paymentMethod: selectedPaymentMethod,
          orderTotal,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart items only if the order is from the cart page
        if (isFromCart) {
          await clearCartItems();
        }
        navigate("/", { state: { orderId: result.data._id } });
      } else {
        setError(result.message || "Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Internal Server Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const clearCartItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch("http://localhost:4000/cart/removeCartAll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to remove all products from cart");
      }
    } catch (error) {
      console.error("Error removing all products from cart:", error);
    } finally {
      setLoading(false);
    }
  };
  const totalCost = calculateTotalCost();
  const deliveryCost = 120; // Example delivery cost
  const orderTotal = totalCost + deliveryCost;

  return (
    <div className="outercontainerbuynow">
      <div className="flexbuyconmain">
        <FloatingOrderSummary
          totalCost={totalCost}
          deliveryCost={deliveryCost}
          orderTotal={orderTotal}
        />
        <div className="mainbuynowcontainer">
          <div className="buynowtitlecontainer">
            <h3 className="buynowtitletxt">Checkout</h3>
            {currentStep === 1 && (
              <div className="buynowaddresscon">
                <h2 className="addressbuytxttitle">Address</h2>
                {addresses.map((address, index) => (
                  <div key={index} className="addressitembuycon">
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={address._id}
                      id={`address-${index}`}
                      checked={selectedAddress === address._id}
                      onChange={handleAddressChange}
                    />
                    <div className="addresfirstcon">
                      <h3 className="addrestxt">{address.name}</h3>
                      <h3 className="addrestxt">{address.mobile}</h3>
                    </div>
                    <h3 className="addrestxt">
                      {address.address}, {address.locality}, {address.city},{" "}
                      {address.state} - {address.pincode}
                    </h3>
                  </div>
                ))}
                {addressFormVisible ? (
                  <div>
                    <AddressForm onSuccess={deactivateForm} />
                    <button
                      onClick={deactivateForm}
                      className="addnewaddresbtn"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button className="addnewaddresbtn" onClick={addNewAddress}>
                    Add New Address
                  </button>
                )}
                {currentStep !== 1 && (
                  <button
                    className="addnewaddresbtn"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                )}
                {currentStep === 1 && selectedAddress && (
                  <button className="addnewaddresbtn" onClick={handleNextStep}>
                    Use this Address
                  </button>
                )}
              </div>
            )}
            {currentStep === 2 && (
              <div className="ordersummarycon">
                <h2 className="addressbuytxttitle">Order Summary</h2>
                {products.map((product) => (
                  <Link
                    key={product.productId}
                    className="custom-link"
                    to={`/product/${product.productId}`}
                  >
                    <div key={product.productId} className="orderitembuycon">
                      <div className="imageconbuyorder">
                        <img
                          src={`http://localhost:4000/${product.image}`}
                          alt={product.name}
                          className="orderconfirmimg"
                        />
                      </div>
                      <div className="secondhalfordercon">
                        <h3 className="ordercontxt">{product.name}</h3>
                        <h3 className="ordercontxt">{product.weight}g</h3>
                        <h3 className="ordercontxt">
                          Quantity: {product.quantity}
                        </h3>
                        <h3 className="ordercontxt">Rs. {product.price}</h3>
                        <button className="removeordercon">Remove</button>
                      </div>
                    </div>
                  </Link>
                ))}
                <button className="addnewaddresbtn" onClick={handleNextStep}>
                  Pay Now
                </button>
                {currentStep !== 1 && (
                  <button
                    className="addnewaddresbtn"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                )}
              </div>
            )}
            {currentStep === 3 && (
              <div className="paymentbuycon">
                <h2 className="addressbuytxttitle">Payment</h2>
                <div className="payemtradiocon">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netBanking"
                    checked={selectedPaymentMethod === "netBanking"}
                    onChange={handlePaymentMethodChange}
                  />
                  <h3 className="radiotxtpay">Net Banking</h3>
                </div>
                <div className="payemtradiocon">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={selectedPaymentMethod === "cashOnDelivery"}
                    onChange={handlePaymentMethodChange}
                  />
                  <h3 className="radiotxtpay">Cash On Delivery</h3>
                </div>
                <div className="payemtradiocon">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="otherUPI"
                    checked={selectedPaymentMethod === "otherUPI"}
                    onChange={handlePaymentMethodChange}
                  />
                  <h3 className="radiotxtpay">Other UPI</h3>
                </div>
                <button
                  className="addnewaddresbtn"
                  onClick={handleConfirmOrder}
                >
                  Confirm Order
                </button>
                {currentStep !== 1 && (
                  <button
                    className="addnewaddresbtn"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductBuy;
