// page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import "./transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ category: "", amount: "", type: "expense" });
  const router = useRouter();
  const API_BASE_URL = "https://personal-finance-backend-aw20.onrender.com/api/transactions";

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };
    fetchTransactions();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(API_BASE_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions([...transactions, res.data]);
      setFormData({ category: "", amount: "", type: "expense" });
    } catch (err) {
      console.error("Error adding transaction", err);
    }
  };

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter(txn => txn._id !== id)); // Update state
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <Link href="/">Overview</Link>
          <Link href="/transactions" className="active">Transactions</Link>
          <Link href="/analytics">Analytics</Link>
        </nav>
        <Link href="/login" className="logout"onClick={() => {
          localStorage.removeItem("token");  // Remove the token
          router.push("/login");  // Redirect to login
        }}>
        Logout</Link>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <h1>Transactions</h1>
        <div className="transactions-layout">
          {/* Form Section */}
          <div className="transactions-form-section">
            <form onSubmit={handleSubmit} className="transactions-form">
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <button type="submit">Add Transaction</button>
            </form>
          </div>

          {/* List Section */}
          <div className="transactions-list-section">
            <ul className="transactions-list">
              {transactions.map((txn) => (
                <li key={txn._id}>
                  <span className="transaction-type">
                    {txn.type}: {txn.category}
                  </span>
                  <span className={`transaction-amount ${txn.type}`}>
                    ₹{txn.amount}
                  </span>
                  <button onClick={() => deleteTransaction(txn._id)} className="delete-button">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}