// Signup.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Import the CSS file

const Signup = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5001/signup', {
        username: username,
        password: password,
      });

      const { user, token } = response.data;

      // Store the token in localStorage or as needed
      localStorage.setItem('token', token);

      navigate(`/documents/${user._id}`);
    } catch (error) {
      console.error('Signup failed:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form">
        <label className="form-label">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </label>
        <br />
        <button type="button" onClick={handleSignup} className="form-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
