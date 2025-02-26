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

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://personal-finance-backend-aw20.onrender.com/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter(txn => txn._id !== id)); // Update state
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

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
        </nav>
        <Link href="/login" className="logout">Logout</Link>
      </div>

      <div className="dashboard-main">
        <h1>Welcome, {user?.name}</h1>
        <div className="card-container">
          <div className="left-column">
            <div className="dashboard-card">
              <h2>Transactions</h2>
              {transactions.length === 0 ? (
                <p>No transactions found.</p>
              ) : (
                <div className="transactions-overview">
                  <div className="expenditure-list">
                    <h3>Expenditure</h3>
                    <ul>
                      {expenditureData.map((item, index) => (
                        <li key={index}>
                          {item.name}: ₹{item.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="income-list">
                    <h3>Income</h3>
                    <ul>
                      {incomeData.map((item, index) => (
                        <li key={index}>
                          {item.name}: ₹{item.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

            <div className="dashboard-card">
              <h2>Expenditure Overview</h2>
              {expenditureData.length === 0 ? (
                <p>No expenditure records found.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={expenditureData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#FF0000" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="dashboard-card">
              <h2>Income Overview</h2>
              {incomeData.length === 0 ? (
                <p>No income records found.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={incomeData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#00FF00" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
