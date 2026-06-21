// Register.jsx
// Register page built with:
// - Shadcn UI components (Button, Input, Label, Card)
// - React Hook Form (handles form state and submission)
// - Zod (defines validation rules)

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ─── VALIDATION SCHEMA ───────────────────────────────────────────────────────────
// Zod schema — defines ALL validation rules for the register form
// Each field has rules, and each rule has a custom error message

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"), // cannot be empty

    email: z
      .string()
      .min(1, "Email is required") // cannot be empty
      .email("Please enter a valid email"), // must be valid email format

    password: z
      .string()
      .min(1, "Password is required") // cannot be empty
      .min(8, "Password must be at least 8 characters"), // minimum 8 chars

    confirmPassword: z.string().min(1, "Please confirm your password"), // cannot be empty
  })
  // .refine() lets us add a rule that checks ACROSS multiple fields
  // Here we check if password and confirmPassword match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match", // error message shown
    path: ["confirmPassword"], // which field to show the error on
  });

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  // serverError — for errors that come FROM the backend
  // e.g. "Email already exists"
  // Different from validation errors which Zod handles automatically

  // ── useForm HOOK ──
  // register     — connects each input to the form
  // handleSubmit — wraps our submit function, only calls it if validation passes
  // formState    — contains errors and isSubmitting
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    // zodResolver connects our Zod schema rules to React Hook Form
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ── SUBMIT HANDLER ──
  // Only called if ALL Zod validation rules pass
  // "data" contains { full_name, email, password, confirmPassword }
  const onSubmit = async (data) => {
    setServerError(null);

    try {
      // ── REAL API CALL (uncomment when backend is ready) ──
      // await client.post("/auth/register", {
      //   full_name: data.full_name,
      //   email: data.email,
      //   password: data.password,
      // })
      // After successful register, redirect to login
      // navigate("/login")

      // ── DUMMY (remove when backend is ready) ──
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/login");
    } catch (err) {
      // Handle backend errors like "Email already registered"
      setServerError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      {/*
        Same centered layout as Login page
        min-h-screen — full viewport height
        flex items-center justify-center — centers the card
        bg-muted/40 — light gray background
      */}

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          {/* Logo circle */}
          <div className="w-11 h-11 bg-[#EEEDFE] rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
            💼
          </div>
          <CardTitle className="text-lg">Create an account</CardTitle>
          <CardDescription>Start tracking your expenses today</CardDescription>
        </CardHeader>

        <CardContent>
          {/* ── SERVER ERROR ──
              Only renders if serverError is not null */}
          {serverError && (
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md mb-4">
              {serverError}
            </div>
          )}

          {/* ── FORM ──
              handleSubmit(onSubmit) — validates first, then calls onSubmit if valid
              space-y-4 — 16px gap between each field */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full name field */}
            <div className="space-y-1">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Kushal Shrivastava"
                {...register("full_name")}
                // {...register("full_name")} connects this input to React Hook Form
                // "full_name" must match the field name in our Zod schema
              />
              {/* Show error message if full_name validation fails */}
              {errors.full_name && (
                <p className="text-destructive text-xs">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="kushal@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password field
                This uses .refine() in Zod to check if it matches password
                The error shows here if they don't match */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit button
                w-full — full width button
                disabled while form is submitting */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
