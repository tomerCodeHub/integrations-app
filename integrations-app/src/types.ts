// src/types.ts
//this is the type for the integration object
//this is used to type the integration object in the app
export interface Integration {
    id: string
    name: string
    description: string
    api_docs_url: string
    config_example: string
    integration_type: string
    created_at: string
    updated_at?: string
    author: string
    ease_of_implementation?: string
    popularity?: string
  }
  