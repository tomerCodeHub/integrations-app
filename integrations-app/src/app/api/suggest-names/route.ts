// src/app/api/suggest-names/route.ts
import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  try {
    const { recentNames } = await req.json()

    const prompt = `Given the following integration names that were already created: ${recentNames.join(
      ", "
    )}, suggest 3 new and unique integration names that are likely to be useful for users. 
Avoid suggesting names that are exactly the same or too similar to the existing ones. 
Only return their names, as a list.`

    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    const suggestionText = res.data.choices?.[0]?.message?.content || ""

    const suggestions = suggestionText
      .split("\n")
      .map((line: string) => line.replace(/^\d+[\).]?\s*/, "").trim())
      .filter((name: string) => name && !recentNames.includes(name)) // <-- Remove repeats

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error("OpenAI suggestion error:", error.response?.data || error.message)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
