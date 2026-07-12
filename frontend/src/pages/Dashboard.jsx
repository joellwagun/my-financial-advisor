//   4 endpoints:
//   GET /auth/me            = { full_name, email, ... }
//   GET /expenses/summary   = { total_spent, total_receipts, by_category }
//   GET /expenses/monthly   = { monthly: { "2026-05": 1234, ... } }
//   GET /expenses           = [ { vendor, date, total_amount, category, ... } ]

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import client from "@/api/client";
import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
);

const CATEGORY_COLORS = {
  Food: "#1D9E75",
  Transport: "#378ADD",
  Shopping: "#D85A30",
  Health: "#D4537E",
  Utilities: "#BA7517",
  Entertainment: "#9B59B6",
  Other: "#888780",
};

function colorFor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
}

function SummaryCard({ label, value, sub }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
        <p className="text-2xl font-medium">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function CategoryBadge({ category }) {
  const color = colorFor(category);
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full mr-2"
      style={{ background: color + "1A", color: color }}
    >
      {category || "Other"}
    </span>
  );
}

function ExpenseRow({ expense }) {
  const color = colorFor(expense.category);
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-b-0">
      <div className="flex items-center gap-2.5">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color }}
        />
        <div>
          <p className="text-sm font-medium">
            {expense.vendor || "Unknown vendor"}
          </p>
          <p className="text-xs text-muted-foreground">
            {expense.date || "No date"}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <CategoryBadge category={expense.category} />
        <span className="text-sm font-medium">
          {expense.currency || "Rs."} {expense.total_amount ?? 0}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    total_spent: 0,
    total_receipts: 0,
    by_category: {},
  });
  const [monthly, setMonthly] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meRes, expensesRes, summaryRes, monthlyRes] = await Promise.all([
          client.get("/auth/me"),
          client.get("/expenses"),
          client.get("/expenses/summary"),
          client.get("/expenses/monthly"),
        ]);
        setUserName(meRes.data.full_name || meRes.data.email);
        setExpenses(expensesRes.data);
        setSummary(summaryRes.data);
        setMonthly(monthlyRes.data.monthly);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const categoryLabels = Object.keys(summary.by_category);
  const categoryAmounts = Object.values(summary.by_category);

  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: categoryLabels.map(colorFor),
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => "Rs. " + ctx.parsed.y.toLocaleString() },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (v) => "Rs." + v.toLocaleString() } },
    },
  };

  const monthLabels = Object.keys(monthly);
  const monthAmounts = Object.values(monthly);

  const lineData = {
    labels: monthLabels,
    datasets: [
      {
        data: monthAmounts,
        borderColor: "#534AB7",
        backgroundColor: "rgba(83,74,183,0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#534AB7",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => "Rs. " + ctx.parsed.y.toLocaleString() },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (v) => "Rs." + v.toLocaleString() } },
    },
  };

  const topCategory = categoryLabels.length
    ? categoryLabels.reduce((a, b) =>
        summary.by_category[a] > summary.by_category[b] ? a : b,
      )
    : "—";

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-medium">Hello!, {userName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">{today}</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <SummaryCard
            label="Total spent"
            value={`Rs. ${summary.total_spent.toLocaleString()}`}
          />
          <SummaryCard
            label="Receipts scanned"
            value={summary.total_receipts}
          />
          <SummaryCard
            label="Top category"
            value={topCategory}
            sub={
              topCategory !== "—"
                ? `Rs. ${summary.by_category[topCategory].toLocaleString()} spent`
                : null
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Spending by category
              </p>
              <div className="relative h-44">
                {categoryLabels.length > 0 ? (
                  <Bar data={barData} options={barOptions} />
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Monthly trend
              </p>
              <div className="relative h-44">
                {monthLabels.length > 0 ? (
                  <Line data={lineData} options={lineOptions} />
                ) : (
                  <p className="text-sm text-muted-foreground">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Recent expenses
            </p>
            {expenses.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No expenses yet — upload a receipt to get started!
              </p>
            )}
            {expenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
