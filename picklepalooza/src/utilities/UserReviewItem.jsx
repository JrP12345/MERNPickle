import React from "react";
import "../styles/UserReviewItem.css";

function UserReviewItem({ review, rating, username, createdAt }) {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  return (
    <div className="reviewitem">
      <div className="userreviewstars">
      {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={`fa-star ${index < rating ? 'fa-solid' : 'fa-regular'}`}
          ></i>
        ))}
      </div>

      <div className="tophalf">
        <div className="usernamereview">
          <h3>{username}</h3>
        </div>
        <h3 className="reviewdatuser">{formattedDate}</h3>
      </div>

      <div className="userreviewdescrpition">
        <h3 className="userreviewdescrpitiontext">
        {review}
        </h3>
      </div>
    </div>
  );
}

export default UserReviewItem;
