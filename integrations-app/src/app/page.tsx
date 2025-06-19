"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user) {
        router.push("/integrations");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4 text-center">
      <div className="max-w-xl bg-base-100 p-8 shadow-lg rounded-xl">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Integration Hub ⚡
        </h1>
        <p className="mb-6 text-lg text-gray-500">
          This app helps you store, manage, and auto-generate metadata for
          third-party integrations using OpenAI.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/login" className="btn btn-primary">
            Log In
          </a>
          <a href="/signup" className="btn btn-outline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
