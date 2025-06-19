"use client";
import React from "react";

// Defining the types for the props passed to the component
interface Props {
  description: string; // Description of the integration
  api_docs_url: string; // URL to the API documentation for the integration
  config_example: string; // Example configuration for the integration
  integration_type: string; // Type/category of the integration
  ease_of_implementation: string; // Ease of implementation for the integration
  popularity: string; // Popularity of the integration
}

export default function AiOutputPreview({
  description,
  api_docs_url,
  config_example,
  integration_type,
  ease_of_implementation,
  popularity,
}: Props) {
  // If no description is provided, return null to render nothing
  if (!description) return null;

  return (
    <div className="space-y-2 mb-6">
      {/* Display the description if it exists */}
      <div>
        <strong>Description:</strong>
        <p className="bg-base-200 rounded p-2">{description}</p>
      </div>

      {/* Display the API documentation URL */}
      <div>
        <strong>API Docs URL:</strong>
        <p className="bg-base-200 rounded p-2">{api_docs_url}</p>
      </div>

      {/* Display the type of the integration in a badge */}
      <div>
        <strong>Integration Type:</strong>
        <p className="badge badge-outline">{integration_type}</p>
      </div>

      {/* Display the configuration example in a preformatted text block */}
      <div>
        <strong>Config Example:</strong>
        <pre className="bg-base-200 rounded p-2 whitespace-pre-wrap text-sm">
          {config_example}
        </pre>
      </div>

      {/* Display the ease of implementation */}
      <div>
        <strong>Ease of Implementation:</strong>
        <p className="bg-base-200 rounded p-2">{ease_of_implementation}</p>
      </div>

      {/* Display the popularity */}
      <div>
        <strong>Popularity:</strong>
        <p className="bg-base-200 rounded p-2">{popularity}</p>
      </div>
    </div>
  );
}
