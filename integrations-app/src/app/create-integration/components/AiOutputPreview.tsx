"use client"
import React from "react"

interface Props {
  description: string
  api_docs_url: string
  config_example: string
  integration_type: string
  ease_of_implementation: string
  popularity: string
}

export default function AiOutputPreview({
  description,
  api_docs_url,
  config_example,
  integration_type,
  ease_of_implementation,
  popularity,
}: Props) {
  if (!description) return null

  return (
    <div className="space-y-2 mb-6">
      <div>
        <strong>Description:</strong>
        <p className="bg-base-200 rounded p-2">{description}</p>
      </div>
      <div>
        <strong>API Docs URL:</strong>
        <p className="bg-base-200 rounded p-2">{api_docs_url}</p>
      </div>
      <div>
        <strong>Integration Type:</strong>
        <p className="badge badge-outline">{integration_type}</p>
      </div>
      <div>
        <strong>Config Example:</strong>
        <pre className="bg-base-200 rounded p-2 whitespace-pre-wrap text-sm">
          {config_example}
        </pre>
      </div>
      <div>
  <strong>Ease of Implementation:</strong>
  <p className="bg-base-200 rounded p-2">{ease_of_implementation}</p>
</div>
<div>
  <strong>Popularity:</strong>
  <p className="bg-base-200 rounded p-2">{popularity}</p>
</div>

    </div>
  )
}
