// Register.jsx
// Register page wired to the real backend.
// Backend endpoint: POST /auth/register
// Expects JSON body: { email, password, full_name }
// Returns: the created user object (UserOut)

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import client from "@/api/client";

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

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ── SUBMIT HANDLER ──
  // Backend's UserCreate schema only needs: email, password, full_name
  // We don't send confirmPassword = that's a frontend-only check
  const onSubmit = async (data) => {
    setServerError(null);

    try {
      await client.post("/auth/register", {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });

      // Registration succeeded => send them to login to sign in
      navigate("/login");
    } catch (err) {
      // e.g. "Email already registered" (from your backend's HTTPException)
      setServerError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-11 h-11 bg-[#EEEDFE] rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
            💼
          </div>
          <CardTitle className="text-lg">Create an account</CardTitle>
          <CardDescription>Start tracking your expenses today</CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Kushal Sharma"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-destructive text-xs">
                  {errors.full_name.message}
                </p>
              )}
            </div>

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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

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
