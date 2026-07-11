// Login page wired to the real backend.
// Backend endpoint: POST /auth/login
// Expects JSON body: { email, password }
// Returns: { access_token, token_type }

import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

// Our pre-configured axios instance (sends baseURL + auth token automatically)
import client from "@/api/client";

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

// --- VALIDATION SCHEMA ---

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});

// --- MAIN COMPONENT ---

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // --- SUBMIT HANDLER ---
  // Calls the real backend.
  // /auth/login expects JSON { email, password }
  // (it reuses the UserCreate schema, not OAuth2PasswordRequestForm)
  const onSubmit = async (data) => {
    setServerError(null);

    try {
      const res = await client.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      // res.data = { access_token, token_type }
      // Save the token so client.js attaches it to every future request
      localStorage.setItem("token", res.data.access_token);

      navigate("/dashboard");
    } catch (err) {
      // FastAPI sends errors as { detail: "..." }
      // e.g. "Invalid credentials"
      setServerError(
        err.response?.data?.detail || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-11 h-11 bg-[#EEEDFE] rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
            💰
          </div>
          <CardTitle className="text-lg">Welcome back</CardTitle>
          <CardDescription>Sign in to your financial advisor</CardDescription>
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-md mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

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
