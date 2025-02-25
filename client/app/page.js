"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  const data = transactions.map((txn) => ({
    name: txn.category,
    amount: txn.amount,
  }));

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <div className="bg-white p-4 shadow-md rounded-md mt-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <ul>
          {transactions.map((txn) => (
            <li key={txn._id} className="border-b py-2">
              {txn.type}: {txn.category} - ₹{txn.amount}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-semibold">Spending Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Link href="/transactions" className="text-blue-500">Manage Transactions</Link>
      <Link href="/login" className="text-blue-500 mt-4 inline-block">Logout</Link>
    </div>
  );
}
