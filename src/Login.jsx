// Login.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Import the CSS file

const Login = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/login', {
        username: username,
        password: password,
      });

      const { user, token } = response.data;

      localStorage.setItem('token', token);

      setAuthenticated(true);
      navigate(`/documents/${user._id}`);
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
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
        <button type="button" onClick={handleLogin} className="form-button">
          Login
        </button>
        <button onClick={() => navigate('/signup')} className="form-button">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Login;
