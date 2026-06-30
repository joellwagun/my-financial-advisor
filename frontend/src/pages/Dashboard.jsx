// Dashboard.jsx
// Main dashboard page rebuilt using Shadcn UI components and Tailwind CSS.
// Currently uses hardcoded/dummy data — will be made dynamic once the
// backend auth + expenses endpoints are ready.

import { useState, useEffect } from "react";

// Chart.js setup — same as before
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

// Shadcn components
import { Card, CardContent } from "@/components/ui/card";

// ─── DUMMY DATA ─────────────────────────────────────────────────────────────────
// Replace with real API calls later:
//   client.get("/expenses").then(res => setExpenses(res.data))

const DUMMY_EXPENSES = [
  {
    id: 1,
    vendor: "Bhat Bhateni",
    date: "Jun 15",
    amount: 1850,
    category: "Shopping",
  },
  {
    id: 2,
    vendor: "Pathao",
    date: "Jun 14",
    amount: 350,
    category: "Transport",
  },
  {
    id: 3,
    vendor: "KFC Thamel",
    date: "Jun 13",
    amount: 920,
    category: "Food",
  },
  {
    id: 4,
    vendor: "Medicare",
    date: "Jun 12",
    amount: 600,
    category: "Health",
  },
  {
    id: 5,
    vendor: "NEA Bill",
    date: "Jun 11",
    amount: 1200,
    category: "Utilities",
  },
];

// One color per category — used consistently across charts, badges, and dots
const CATEGORY_COLORS = {
  Food: "#1D9E75",
  Transport: "#378ADD",
  Shopping: "#D85A30",
  Health: "#D4537E",
  Utilities: "#BA7517",
  Other: "#888780",
};

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────────

// SummaryCard — the 3 cards at the top
// Props: label, value, sub
function SummaryCard({ label, value, sub }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
        <p className="text-2xl font-medium">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

// CategoryBadge — colored pill showing category name
// Props: category
function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full mr-2"
      style={{ background: color + "1A", color: color }}
      // "1A" appended to hex = ~10% opacity background
    >
      {category}
    </span>
  );
}

// ExpenseRow — one row in the recent expenses list
// Props: expense
function ExpenseRow({ expense }) {
  const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-b-0">
      {/* last:border-b-0 — Tailwind removes the border on the LAST row only */}

      <div className="flex items-center gap-2.5">
        {/* Colored dot matching the category color */}
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color }}
        />
        <div>
          <p className="text-sm font-medium">{expense.vendor}</p>
          <p className="text-xs text-muted-foreground">{expense.date}</p>
        </div>
      </div>

      <div className="flex items-center">
        <CategoryBadge category={expense.category} />
        <span className="text-sm font-medium">
          Rs. {expense.amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD COMPONENT ───────────────────────────────────────────────────

export default function Dashboard() {
  const [expenses, setExpenses] = useState(DUMMY_EXPENSES);
  const [totalSpent] = useState(12450);
  const [receiptCount] = useState(24);

  // useEffect — runs once when the page loads
  // This is where the real API call will go later
  useEffect(() => {
    // TODO: replace with real API call once backend is ready
    // client.get("/expenses").then(res => setExpenses(res.data))
  }, []);

  // Today's date as a readable string
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── CHART DATA ──

  const barData = {
    labels: ["Food", "Transport", "Shopping", "Health", "Utilities"],
    datasets: [
      {
        data: [4200, 2100, 3100, 1500, 1550],
        backgroundColor: [
          CATEGORY_COLORS.Food,
          CATEGORY_COLORS.Transport,
          CATEGORY_COLORS.Shopping,
          CATEGORY_COLORS.Health,
          CATEGORY_COLORS.Utilities,
        ],
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
      y: { ticks: { callback: (v) => "Rs." + (v / 1000).toFixed(0) + "k" } },
    },
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [9200, 10500, 8800, 11200, 13000, 12450],
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
      y: { ticks: { callback: (v) => "Rs." + (v / 1000).toFixed(0) + "k" } },
    },
  };

  // ── RENDER ──

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/*
        max-w-4xl — limits page width so it doesn't stretch too wide on big screens
        mx-auto — centers the whole dashboard horizontally
        p-6 — padding all around
      */}

      {/* ── HEADER ── */}
      <div className="mb-6">
        <h1 className="text-xl font-medium">Good morning, Kushal 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
      </div>

      {/* ── SUMMARY CARDS ──
          grid-cols-3 — 3 equal columns side by side */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <SummaryCard
          label="Total spent this month"
          value={`Rs. ${totalSpent.toLocaleString()}`}
          sub="↑ 8% from last month"
        />
        <SummaryCard
          label="Receipts scanned"
          value={receiptCount}
          sub="this month"
        />
        <SummaryCard label="Top category" value="Food" sub="Rs. 4,200 spent" />
      </div>

      {/* ── CHARTS ──
          grid-cols-2 — 2 equal columns side by side */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Spending by category
            </p>
            {/* relative + fixed height is required for Chart.js to render correctly */}
            <div className="relative h-44">
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Monthly trend
            </p>
            <div className="relative h-44">
              <Line data={lineData} options={lineOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── RECENT EXPENSES ── */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Recent expenses
          </p>

          {/* .map() loops over the expenses array and renders one row per item
              key={expense.id} is required by React to track each item efficiently */}
          {expenses.map((expense) => (
            <ExpenseRow key={expense.id} expense={expense} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
