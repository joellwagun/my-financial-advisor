// Login.jsx
// Login page built with:
// - Shadcn UI components (Button, Input, Label, Card)
// - React Hook Form (handles form state and submission)
// - Zod (defines validation rules)

import { useNavigate, Link } from "react-router-dom";

// useForm — the main hook from React Hook Form
// It manages all form state (values, errors, submission) for us
import { useForm } from "react-hook-form";

// zodResolver — connects Zod's validation rules to React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// z — Zod's main object. We use it to define our validation schema
import { z } from "zod";

// useState — only needed for the loading state and server errors
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
// This is where we define ALL our validation rules using Zod.
// Think of it as a rulebook for the form.
// Each field has rules, and each rule has an error message.

const loginSchema = z.object({
  email: z
    .string() // must be a string
    .min(1, "Email is required") // cannot be empty
    .email("Please enter a valid email"), // must look like an email (has @ and .)

  password: z
    .string() // must be a string
    .min(1, "Password is required") // cannot be empty
    .min(8, "Password must be at least 8 characters"), // minimum length
});

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  // serverError is for errors that come FROM the backend
  // e.g. "Wrong password" or "User not found"
  // This is different from validation errors (which Zod handles)

  // ── useForm HOOK ──
  // This is the heart of React Hook Form.
  // register  — connects each input to the form
  // handleSubmit — wraps our submit function with validation
  // formState   — contains { errors } which holds all validation error messages
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // isSubmitting — true while the async submit function is running
    // We use this instead of a separate loading useState
  } = useForm({
    resolver: zodResolver(loginSchema),
    // zodResolver connects our loginSchema rules to React Hook Form
    // Now the form automatically validates against our Zod schema
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ── SUBMIT HANDLER ──
  // handleSubmit from React Hook Form calls this function ONLY if validation passes
  // If validation fails, it shows errors automatically and never calls this function
  // "data" contains the validated form values { email, password }
  const onSubmit = async (data) => {
    setServerError(null); // clear any old server errors

    try {
      // ── REAL API CALL (uncomment when backend is ready) ──
      // const formData = new FormData()
      // formData.append("username", data.email)
      // formData.append("password", data.password)
      // const res = await client.post("/auth/login", formData)
      // localStorage.setItem("token", res.data.access_token)
      // navigate("/dashboard")

      // ── DUMMY (remove when backend is ready) ──
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.detail || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      {/*
        min-h-screen — full viewport height
        flex items-center justify-center — centers the card perfectly
        bg-muted/40 — light gray background (muted color at 40% opacity)
      */}

      <Card className="w-full max-w-sm">
        {/*
          Card from Shadcn — white box with border and shadow
          max-w-sm — maximum width of 384px
        */}

        <CardHeader className="text-center">
          {/* Logo circle */}
          <div className="w-11 h-11 bg-[#EEEDFE] rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
            💼
          </div>
          <CardTitle className="text-lg">Welcome back</CardTitle>
          <CardDescription>Sign in to your financial advisor</CardDescription>
          {/*
            CardTitle and CardDescription are Shadcn components
            They automatically apply the right font size and color
          */}
        </CardHeader>

        <CardContent>
          {/* ── SERVER ERROR ──
              Only shows if serverError state is not null */}
          {serverError && (
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md mb-4">
              {/*
                bg-destructive/10 — Shadcn's red color at 10% opacity (light red background)
                text-destructive — Shadcn's red text color
                These automatically adapt to dark mode
              */}
              {serverError}
            </div>
          )}

          {/* ── FORM ──
              onSubmit={handleSubmit(onSubmit)}
              handleSubmit runs validation first.
              If validation passes → calls onSubmit(data)
              If validation fails → shows errors, does NOT call onSubmit */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/*
              space-y-4 — adds 16px vertical gap between each child div
            */}

            {/* Email field */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              {/*
                Label from Shadcn — styled label
                htmlFor connects it to the input with id="email"
              */}

              <Input
                id="email"
                type="email"
                placeholder="kushal@example.com"
                {...register("email")}
                // {...register("email")} — this connects the input to React Hook Form
                // It adds onChange, onBlur, name, and ref automatically
                // "email" must match the field name in our Zod schema
              />

              {/* Validation error message
                  errors.email exists only if the email field has a validation error
                  errors.email.message is the string we defined in Zod e.g. "Invalid email" */}
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

            {/* Submit button
                disabled={isSubmitting} — button is disabled while form is submitting
                isSubmitting comes from React Hook Form — no need for separate useState */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
