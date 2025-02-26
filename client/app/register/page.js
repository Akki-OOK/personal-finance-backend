"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    if (!formData.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    try {
      const res = await axios.post("https://personal-finance-backend-aw20.onrender.com/api/users/register", formData);
      console.log("Registration successful", res.data);
      router.push("/login"); // Redirect to login page after registration
    } catch (err) {
      console.error("Registration error", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister} className="form-container">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={!formData.name || !formData.email || !formData.password}>Register</button>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
