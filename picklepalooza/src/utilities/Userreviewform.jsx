import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Userreviewform.css";

const Userreviewform = () => {
  const { productId } = useParams(); // Access productId from URL parameters
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/review/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review, rating, productId }), // Include product ID in the request body
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        setResponseMessage('Review added successfully');
        setReview('');
        setRating(0);
      } else {
        setResponseMessage(result.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Add Review Error:', error);
      setResponseMessage('Internal Server Error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="reviewproductcontainer">
        <div className="firstreviewcontainer">
          <h5 className="formrevtxt">Rating</h5>
          <div className="userreviewstars">
            {[1, 2, 3, 4, 5].map((value) => (
              <i
                key={value}
                className={`fa-star star-icon ${rating >= value ? 'fa-solid' : 'fa-regular'}`}
                onClick={() => handleRating(value)}
              ></i>
            ))}
          </div>
        </div>
        <h5 className="formrevtxt">Review</h5>
        <textarea
          className="reviewextbox"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <button className="reviewuserbtn" type="submit">Submit</button>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
      </div>
    </form>
  );
}

export default Userreviewform;
