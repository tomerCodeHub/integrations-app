"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// UI components
import SearchFilters from "./components/SearchFilters";
import IntegrationTable from "./components/IntegrationList";
import { Integration } from "@/types";
import SidebarLayout from "../components/SidebarLayout";

export default function IntegrationListPage() {
  // State for storing logged-in user’s email
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // All fetched integrations from Supabase (user-specific)
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  // UI loading + error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  /**
   * This useEffect runs when the page loads.
   * It checks if the user is logged in via Supabase,
   * and if so, fetches ONLY their integrations.
   */
  useEffect(() => {
    const fetchUserIntegrations = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch user's username from `profiles` table
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      // Use username if available, else fallback to email
      const author = profileData?.username ?? user.email;
      setUserEmail(author); // Save author identifier for filters

      // Fetch integrations by this author
      // Fetch integrations by author (username OR fallback email)
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .or(`author.eq.${author},author.eq.${user.email}`)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setIntegrations(data || []);
      }

      setLoading(false);
    };

    fetchUserIntegrations();
  }, [router]);

  // While loading, show feedback
  if (loading) return <div className="p-6">Loading integrations...</div>;

  // If an error occurred, show an alert
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <SidebarLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Your Integrations</h1>

        {/* Filters component */}
        <SearchFilters
          integrations={integrations}
          onFilter={(filtered) => setIntegrations(filtered)} // update filtered list
          userEmail={userEmail}
        />
        <button
          className="btn bg-cyan-600 text-black hover:bg-cyan-700 text-white"
          onClick={() => router.push("/create-integration")}
        >
          + New Integration
        </button>
        {/* Table component to render integrations */}
        <IntegrationTable
          integrations={integrations}
          setIntegrations={setIntegrations}
        />
      </div>
    </SidebarLayout>
  );
}
