// ExpenseDetail.jsx
// Shows the full details of a single expense including all items.
// Also allows the user to delete the expense.
//
// Backend endpoints used:
//   GET /expenses/{id}    = full expense with items
//   DELETE /expenses/{id} = deletes the expense

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import client from "@/api/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// One color per category
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

export default function ExpenseDetail() {
  const navigate = useNavigate();

  // useParams reads the :id from the URL
  // e.g. /expenses/abc-123 : id = "abc-123"
  const { id } = useParams();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch expense details when page loads
  useEffect(() => {
    client
      .get(`/expenses/${id}`)
      .then((res) => setExpense(res.data))
      .catch(() => setError("Expense not found."))
      .finally(() => setLoading(false));
  }, [id]);

  // Delete the expense = called when user confirms in the dialog
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await client.delete(`/expenses/${id}`);
      navigate("/expenses");
    } catch (err) {
      setError("Failed to delete expense. Please try again.");
      setDeleting(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-lg mx-auto p-6 text-sm text-muted-foreground">
          Loading expense...
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error && !expense) {
    return (
      <div>
        <Navbar />
        <div className="max-w-lg mx-auto p-6">
          <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md mb-4">
            {error}
          </div>
          <Button variant="outline" onClick={() => navigate("/expenses")}>
            Back to expenses
          </Button>
        </div>
      </div>
    );
  }

  const color = colorFor(expense.category);

  return (
    <div>
      <Navbar />

      <div className="max-w-lg mx-auto p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium">
              {expense.vendor || "Unknown vendor"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {expense.date || "No date"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/expenses")}
          >
            Back
          </Button>
        </div>

        {/*EXPENSE SUMMARY CARD */}
        <Card className="mb-4">
          <CardContent className="p-5 space-y-3">
            {/* Category badge */}
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color }}
              />
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: color + "1A", color: color }}
              >
                {expense.category || "Other"}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendor</span>
                <span className="font-medium">{expense.vendor || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{expense.date || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total amount</span>
                <span className="font-medium">
                  {expense.currency || "Rs."} {expense.total_amount ?? "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ITEMS CARD
            Only shows if the expense has items */}
        {expense.items && expense.items.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Items
              </p>
              {expense.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm py-2 border-b last:border-b-0"
                >
                  <span>{item.name || "Unknown item"}</span>
                  <span className="font-medium">
                    {expense.currency || "Rs."} {item.amount ?? "—"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* DELETE BUTTON WITH CONFIRMATION DIALOG
            AlertDialog from Shadcn = looks consistent with the app
            instead of the ugly browser window.confirm() popup */}
        <AlertDialog>
          {/* This button triggers the dialog to open */}
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete expense"}
            </Button>
          </AlertDialogTrigger>

          {/* The dialog content */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This expense and all its items
                will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* Cancel : closes the dialog, does nothing */}
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              {/* Confirm : calls handleDelete */}
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Show error if delete failed */}
        {error && expense && (
          <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md mt-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
