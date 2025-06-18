/**
 * Dashboard Page
 *
 * Why we do things:
 * - We check for a valid user session to ensure only authenticated users can access their integrations.
 * - If the user is not authenticated, we redirect them to the login page to protect their data.
 * - We fetch integrations from the database filtered by the user's email, so each user only sees their own integrations.
 * - If the user has no integrations, we redirect them to the integration creation page to encourage onboarding and engagement.
 * - Errors in fetching data are surfaced to the user for transparency and troubleshooting.
 * - While loading, we show a loading indicator to provide feedback and avoid a blank screen.
 *
 * What we do:
 * - Authenticate user and handle redirects.
 * - Fetch and display user-specific integrations.
 * - Handle loading and error states.
 * - Provide navigation to create new integrations if none exist.
 */
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Integration } from "@/types"


export default function DashboardPage() {
  const router = useRouter()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
        //check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      const user = sessionData?.session?.user
      //if user is not authenticated, redirect to login page
      if (sessionError || !user) {
        router.push("/login")
        return
      }
      //fetch integrations for the current user
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("author", user.email)
      //if there is an error, set the error and loading state
      if (error) {
        setError("Failed to load integrations.")
        setLoading(false)
        return
      }
      //if the user has no integrations, redirect to the integration creation page
      if (!data || data.length === 0) {
        router.push("/create-integration")
      } else {
        setIntegrations(data)
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (error) return <div className="alert alert-error max-w-lg mx-auto mt-6">{error}</div>
  //render the dashboard UI with the user's integrations in a responsive grid
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Integrations</h1>
       <div className="p-4">
       <button
          className="btn btn-primary p-4 rounded-full"
          onClick={() => router.push("/create-integration")}
        >
          + New Integration
        </button>
       </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((i) => (
          <div key={i.id} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">{i.name}</h2>
              <p>{i.description}</p>
              <div className="badge badge-outline">{i.integration_type}</div>
              <p className="text-sm text-gray-400 mt-2">{new Date(i.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




