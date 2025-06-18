import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  try {
    const { name } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    console.log("Generating metadata for:", name)

    // ✅ Define the prompt here
    const prompt = `
Generate integration metadata for the service "${name}". Please return the following fields, each enclosed in their respective tags exactly as shown:

[DESCRIPTION]
A short description of the service.
[/DESCRIPTION]

[DOCS]
Link to official API documentation.
[/DOCS]

[TYPE]
One of: Email, Messaging, Billing, Chat, CRM, Payment
[/TYPE]

[CONFIG]
{
  "example_key": "example_value"
}
[/CONFIG]

[EASE]
How easy is it to implement and use this integration in large teams? Short sentence.
[/EASE]

[POPULARITY]
Is this integration widely adopted or niche? Short sentence.
[/POPULARITY]
`

    // ✅ Call OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    const output = response.data.choices?.[0]?.message?.content

    return NextResponse.json({ result: output })
  } catch (error: any) {
    console.error("OpenAI error:", error.response?.data || error.message)
    return NextResponse.json({ error: "OpenAI request failed" }, { status: 500 })
  }
}
``
