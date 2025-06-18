"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import axios from "axios"

// UI components
import NameInput from "./components/NameInput"
import GenerateControls from "./components/GenerateControls"
import AiOutputPreview from "./components/AiOutputPreview"
import SidebarLayout from "../components/SidebarLayout"
import SuggestedIntegrationNames from "./components/SuggestedIntegrationNames"

export default function CreateIntegrationPage() {
  const router = useRouter()

  // Form state
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Auth & user-related state
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Store last 3 user-created integrations (for suggestions)
  const [lastThree, setLastThree] = useState<any[]>([])

  // Store AI-generated metadata
  const [aiOutput, setAiOutput] = useState({
    description: "",
    api_docs_url: "",
    config_example: "",
    integration_type: "",
    ease_of_implementation: "",
    popularity: "",
  })

  /**
   * On mount, fetch the current user session and last 3 integrations.
   */
  useEffect(() => {
    const fetchRecent = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData?.session?.user
      if (!user) return router.push("/login")

      setUserEmail(user.email ?? null)

      // Fetch last 3 integrations created by this user
      const { data } = await supabase
        .from("integrations")
        .select("*")
        .eq("author", user.email)
        .order("created_at", { ascending: false })
        .limit(3)

      if (data) setLastThree(data)
    }

    fetchRecent()
  }, [router])

  /**
   * Utility function to extract a tagged section (e.g., [DESCRIPTION]...[/DESCRIPTION])
   */
  const extractTagged = (text: string, tag: string): string => {
    const match = text.match(new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[/${tag}\\]`, "i"))
    return match?.[1]?.trim() || ""
  }

  /**
   * Triggers OpenAI to generate metadata for the current integration name.
   */
  const handleGenerate = async () => {
    if (!name) {
      setError("Please enter a name.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await axios.post("/api/generate", { name })
      const text: string = res.data.result || ""

      // Extract each field from the AI response using custom tags
      setAiOutput({
        description: extractTagged(text, "DESCRIPTION"),
        api_docs_url: extractTagged(text, "DOCS"),
        config_example: extractTagged(text, "CONFIG"),
        integration_type: extractTagged(text, "TYPE"),
        ease_of_implementation: extractTagged(text, "EASE"),
        popularity: extractTagged(text, "POPULARITY"),
      })
    } catch (err) {
      setError("AI generation failed. Try again.")
    }

    setLoading(false)
  }

  /**
   * Saves the generated integration to Supabase with the current user's email or username.
   */
  const handleSave = async () => {
    setLoading(true)

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user
    if (!user) {
      setError("Not logged in.")
      setLoading(false)
      return
    }

    // Try to use the username from the `profiles` table, fallback to email
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()

    const { error: insertError } = await supabase.from("integrations").insert([
      {
        name,
        description: aiOutput.description,
        api_docs_url: aiOutput.api_docs_url,
        config_example: aiOutput.config_example,
        integration_type: aiOutput.integration_type,
        ease_of_implementation: aiOutput.ease_of_implementation,
        popularity: aiOutput.popularity,
        author: profileData?.username ? profileData.username : user.email,
      },
    ])

    if (insertError) setError(insertError.message)
    else router.push("/integrations")

    setLoading(false)
  }

  /**
   * Called when the user selects a suggestion (name) from SuggestedIntegrationNames
   */
  const handleSelect = (name: string) => {
    setName(name)
  }

  return (
    <SidebarLayout>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Create Integration</h1>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        {/* Text input for the integration name */}
        <NameInput name={name} setName={setName} />

        {/* Buttons to generate/save integration */}
        <GenerateControls
          onGenerate={handleGenerate}
          onSave={handleSave}
          loading={loading}
          canSave={!!aiOutput.description}
        />

        {/* Preview the generated AI content */}
        <AiOutputPreview {...aiOutput} />

        {/* Suggest names based on the last 3 integrations */}
        <SuggestedIntegrationNames userEmail={userEmail} onSelect={handleSelect} />

        {/* Navigation button */}
        <div className="mt-6">
          <button className="btn bg-cyan-200 text-black hover:bg-cyan-300" onClick={() => router.push("/integrations")}>
            View All
          </button>
        </div>
      </div>
    </SidebarLayout>
  )
}
