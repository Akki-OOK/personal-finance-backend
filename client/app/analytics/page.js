"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import "./analytics.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

export default function Analytics() {
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
    .reduce((acc, txn) => {
      const found = acc.find((item) => item.name === txn.category);
      if (found) {
        found.value += txn.amount;
      } else {
        acc.push({ name: txn.category, value: txn.amount });
      }
      return acc;
    }, []);

  const incomeData = transactions
    .filter(txn => txn.type === "income")
    .reduce((acc, txn) => {
      const found = acc.find((item) => item.name === txn.category);
      if (found) {
        found.value += txn.amount;
      } else {
        acc.push({ name: txn.category, value: txn.amount });
      }
      return acc;
    }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <Link href="/">Overview</Link>
          <Link href="/transactions">Transactions</Link>
          <Link href="/analytics" className="active">Analytics</Link>
        </nav>
        <Link href="/login" className="logout"onClick={() => {
          localStorage.removeItem("token");  // Remove the token
          router.push("/login");  // Redirect to login
        }}>
        Logout</Link>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <h1>Analytics</h1>
        <div className="analytics-layout">
          {/* Analytics Section */}
          <div className="analytics-section">
            <div className="charts-container">
              <div className="chart">
                <h3>Expenditure</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={expenditureData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#FF8042" label>
                      {expenditureData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart">
                <h3>Income</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#0088FE" label>
                      {incomeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <Link href="/" className="back-button">Back to Dashboard</Link>
      </div>
    </div>
  );
}
