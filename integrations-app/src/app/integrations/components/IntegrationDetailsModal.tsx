'use client'

import { Integration } from "@/types"

interface Props {
  integration: Integration
  onClose: () => void
}

/**
 * A focused modal without dimming the entire background.
 * Styled as a floating centered card.
 */
export default function IntegrationDetailsModal({ integration, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative pointer-events-auto bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-2xl border border-neutral">
        {/* ✕ Close Button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
          onClick={onClose}
        >
          ✕
        </button>

        {/*  Integration Name */}
        <h2 className="text-2xl font-bold mb-4">{integration.name}</h2>

        <div className="space-y-3 text-sm">
          {/*  Description */}
          <div>
            <span className="font-semibold">Description:</span>
            <p className="bg-base-200 p-2 rounded mt-1">{integration.description}</p>
          </div>

          {/*  Type */}
          <div>
            <span className="font-semibold">Integration Type:</span>
            <div className="badge badge-outline ml-2">{integration.integration_type}</div>
          </div>

          {/*  Created */}
          <div>
            <span className="font-semibold">Created At:</span>
            <span className="ml-2">{new Date(integration.created_at).toLocaleString()}</span>
          </div>

          {/* 👤 Author */}
          <div>
            <span className="font-semibold">Author:</span>
            <span className="ml-2">{integration.author}</span>
          </div>

          {/*  API Docs */}
          <div>
            <span className="font-semibold">API Docs URL:</span>
            <a
              href={integration.api_docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="link ml-2"
            >
              {integration.api_docs_url}
            </a>
          </div>

          {/* 🛠️ Config */}
          <div>
            <span className="font-semibold">Config Example:</span>
            <pre className="bg-base-200 p-3 rounded mt-1 whitespace-pre-wrap text-xs">
              {integration.config_example}
            </pre>
          </div>
          <div>
            <span className="font-semibold">Ease of Implementation:</span>
            <p className="bg-base-200 p-2 rounded mt-1">{integration.ease_of_implementation}</p>
          </div>
          <div>
            <span className="font-semibold">Popularity:</span>
            <p className="bg-base-200 p-2 rounded mt-1">{integration.popularity}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
