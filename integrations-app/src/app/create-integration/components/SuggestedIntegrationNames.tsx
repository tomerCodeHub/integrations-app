"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";

interface Props {
  userEmail: string | null;
  onSelect: (name: string) => void; // callback to prefill or create with selected name
}

export default function SuggestedIntegrationNames({
  userEmail,
  onSelect,
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userEmail) return;
      setLoading(true);

      // Get last 3 integration names by this user
      const { data, error } = await supabase
        .from("integrations")
        .select("name")
        .eq("author", userEmail)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      const recentNames = data?.map((i) => i.name);

      try {
        const res = await axios.post("/api/suggest-names", { recentNames });
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userEmail]);

  if (!suggestions.length && !loading) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-3">AI Suggestions for you</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Generating suggestions...</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {suggestions.map((name) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="btn  btn-sm bg-pink-100 text-black hover:bg-pink-200"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
