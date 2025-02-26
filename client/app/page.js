"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./dash.css"; // Import external CSS file

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userRes = await axios.get("https://personal-finance-backend-aw20.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const txnRes = await axios.get("https://personal-finance-backend-aw20.onrender.com/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(txnRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchData();
  }, []);

  const expenditureData = transactions
    .filter(txn => txn.type === "expense")
    .map(txn => ({ name: txn.category, amount: txn.amount }));

  const incomeData = transactions
    .filter(txn => txn.type === "income")
    .map(txn => ({ name: txn.category, amount: txn.amount }));

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <Link href="/transactions">Transactions</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/settings">Settings</Link>
        </nav>
        <Link href="/login" className="logout">Logout</Link>
      </div>

      <div className="dashboard-main">
        <h1>Welcome, {user?.name}</h1>
        <div className="card-container">
          <div className="left-column">
            <div className="dashboard-card">
              <h2>Transactions</h2>
              <ul className="transactions-table">
                {transactions.map((txn) => (
                  <li key={txn._id}>
                    {txn.type}: {txn.category} - ₹{txn.amount}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="right-column">
            <div className="transactions-card">
              <h2>Expenditure Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={expenditureData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#FF0000" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="transactions-card">
              <h2>Income Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#00FF00" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
