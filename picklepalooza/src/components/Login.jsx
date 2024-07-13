import React, { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Login({ updateLoggedInState }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        // Handle successful login
        console.log("Login successful");
        localStorage.setItem("isLoggedIn", "true");
        updateLoggedInState(true);
        navigate("/");
      } else {
        // Handle login failure
        console.error("Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <div className="register-container">
      <div className="register-form">
        <div className="reg-title">
          <h1>Login</h1>
          <h6>Please login using account detail bellow.</h6>
        </div>
        <div className="reg-details">
          <input
            type="text"
            placeholder="Email"
            className="regtxtfiled"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Password"
            className="regtxtfiled"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="submitbtn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="loginconatiner">
          <Link to="/register" className="custom-link">
            <h5>Already Have an Account?</h5>
          </Link>

          <h6>Forget Your Password</h6>
        </div>
      </div>
    </div>
  );
}

export default Login;
