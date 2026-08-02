// To show all of the logged-in user's expenses in a simple list.
// Backend endpoint: GET /expenses
// Returns: [ { id, vendor, date, total_amount, currency, category, created_at } ]

// Expenses.jsx
// Shows all of the logged-in user's expenses in a simple list.
// Each expense card is clickable = clicking takes you to the detail page.
// Backend endpoint: GET /expenses

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import client from "@/api/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

function CategoryBadge({ category }) {
  const color = colorFor(category);
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{ background: color + "1A", color: color }}
    >
      {category || "Other"}
    </span>
  );
}

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/expenses")
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6 text-sm text-muted-foreground">
          Loading expenses...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium">My expenses</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {expenses.length} receipt{expenses.length !== 1 ? "s" : ""}{" "}
              uploaded
            </p>
          </div>
          <Button onClick={() => navigate("/upload")}>+ Upload receipt</Button>
        </div>

        {/* Empty state */}
        {expenses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-3xl mb-3">🧾</p>
              <p className="text-sm font-medium mb-1">No expenses yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your first receipt to get started
              </p>
              <Button onClick={() => navigate("/upload")}>
                Upload receipt
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Expenses list
            Each card is clickable = navigate to /expenses/{id} */}
        <div className="space-y-3">
          {expenses.map((expense) => (
            <Card
              key={expense.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/expenses/${expense.id}`)}
              // navigate to the detail page with this expense's ID in the URL
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* Left: dot + vendor + date */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: colorFor(expense.category) }}
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

                  {/* Right: badge + amount + arrow */}
                  <div className="flex items-center gap-3">
                    <CategoryBadge category={expense.category} />
                    <p className="text-sm font-medium">
                      {expense.currency || "Rs."} {expense.total_amount ?? "—"}
                    </p>
                    {/* Arrow hint to show it's clickable */}
                    <span className="text-muted-foreground text-sm"></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
