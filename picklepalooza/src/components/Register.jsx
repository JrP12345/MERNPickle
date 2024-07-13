import React, { useState } from "react";
import "../styles/Register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Register() {
  const navigate =useNavigate();
  const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:""
  })
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://mernpickle-backend.onrender.com/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Sending form data as JSON
      });
  
      if (response.ok) {
        const data = await response.json();
        // Handle successful response from the backend
        console.log('User registered successfully:', data);
        navigate("/login")
      } else {
        // Handle errors from the backend
        const errorData = await response.json();
        console.error('Failed to register user:', errorData);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('An error occurred:', error);
    }
  };
  
 
  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="register-container">
        <div className="register-form">
          <div className="reg-title">
            <h1>Create Account</h1>
            <h6>Please Register using account detail bellow.</h6>
          </div>
          <div className="reg-details">
            <input type="text" placeholder="Username" className="regtxtfiled" name="username" value={formData.username}  onChange={handleChange}/>
            <input type="email" placeholder="Email" className="regtxtfiled" name="email" value={formData.email}  onChange={handleChange}/>
            <input type="password" placeholder="Password" className="regtxtfiled" name="password" value={formData.password}  onChange={handleChange}/>
            {/* <input
              type="password"
              placeholder="Confirm Password"
              className="regtxtfiled"
              name="confirmpassword"
            /> */}
            <button className="submitbtn" type="submit">Submit</button>
          </div>
          <div className="login">
            <Link to="/login" className="custom-link">
              <h5>Already Have an Account?Login</h5>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Register;
