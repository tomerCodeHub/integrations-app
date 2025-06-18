"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    setShowLoginButton(false);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Check your email for a confirmation link!");
      setShowLoginButton(true);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md p-6 bg-base-100 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <input
          className="input input-bordered w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!success}
        />

        <input
          className="input input-bordered w-full mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!!success}
        />
        {error && <p className="text-error mb-3">{error}</p>}
        {success && <p className="text-success mb-3">{success}</p>}
        {loading && (
          <div className="text-center text-sm text-gray-500 mb-2">
            Sending sign-up request...
          </div>
        )}
        {!showLoginButton && (
          <button
            className="btn btn-primary w-full"
            onClick={handleSignUp}
            disabled={!!success}
          >
            Sign Up
          </button>
        )}
        {showLoginButton && (
          <button className="btn btn-success w-full" onClick={handleGoToLogin}>
            Go to Login
          </button>
        )}
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <a href="/login" className="link link-primary">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}
