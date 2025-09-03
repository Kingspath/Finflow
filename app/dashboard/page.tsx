"use client";

import UploadStatement from "@/components/UploadStatement";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { fetchTransactions } from "@/lib/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin");
        return;
      }
      setUser(user);

      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;
      if (token) {
        try {
          const tx = await fetchTransactions(token);
          setTransactions(tx);
        } catch (err) {
          console.error("Error fetching transactions", err);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [router]);

  const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = income - expenses;

  const pieData = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="min-h-screen bg-finflow-light">
      {/* Header */}
<header className="flex justify-between items-center px-8 py-6 bg-white shadow-finflow-card">
  <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
  <UploadStatement onUpload={() => window.location.reload()} />
</header>

      {/* Balance Cards */}
      <section className="grid md:grid-cols-3 gap-6 px-8 py-8">
        <div className="card-hover">
          <h2 className="text-lg font-bold">💰 Total Income</h2>
          <p className="text-2xl font-semibold text-finflow-secondary">
            R {income.toFixed(2)}
          </p>
        </div>
        <div className="card-hover">
          <h2 className="text-lg font-bold">💸 Total Expenses</h2>
          <p className="text-2xl font-semibold text-finflow-danger">
            R {expenses.toFixed(2)}
          </p>
        </div>
        <div className="card-hover">
          <h2 className="text-lg font-bold">📊 Net Balance</h2>
          <p className="text-2xl font-semibold text-finflow-primary">
            R {balance.toFixed(2)}
          </p>
        </div>
      </section>

      {/* Charts */}
      <section className="grid md:grid-cols-2 gap-6 px-8 py-8">
        {/* Cashflow Line Chart */}
        <div className="card-hover">
          <h2 className="text-lg font-bold mb-4">Cashflow Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={transactions}>
              <Line type="monotone" dataKey="amount" stroke="#2563eb" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses Pie */}
        <div className="card-hover">
          <h2 className="text-lg font-bold mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="px-8 py-8">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Date</th>
                <th className="py-2">Description</th>
                <th className="py-2">Category</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-finflow-gray">
                    Loading...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.slice(0, 5).map((t, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{t.date}</td>
                    <td className="py-2">{t.description}</td>
                    <td className="py-2">{t.category}</td>
                    <td className={`py-2 ${t.type === "expense" ? "text-finflow-danger" : "text-finflow-secondary"}`}>
                      R {t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-finflow-gray">
                    No transactions yet. Upload a statement to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
