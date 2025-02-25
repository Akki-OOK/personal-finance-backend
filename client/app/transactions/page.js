"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

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

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <form onSubmit={handleSubmit} className="mt-4 bg-white p-4 shadow-md rounded-md">
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
          required
          className="border p-2 rounded-md w-full mb-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
          className="border p-2 rounded-md w-full mb-2"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full mb-2"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full">Add Transaction</button>
      </form>
      <ul className="mt-6 bg-white p-4 shadow-md rounded-md">
        {transactions.map((txn) => (
          <li key={txn._id} className="border-b py-2">
            {txn.type}: {txn.category} - ₹{txn.amount}
          </li>
        ))}
      </ul>
      <Link href="/" className="text-blue-500 mt-4 inline-block">Back to Dashboard</Link>
    </div>
  );
}
