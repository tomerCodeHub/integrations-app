"use client"
import React from "react"

interface Props {
  onGenerate: () => void
  onSave: () => void
  loading: boolean
  canSave: boolean
}

export default function GenerateControls({
  onGenerate,
  onSave,
  loading,
  canSave,
}: Props) {
  return (
    <div className="flex gap-3 mb-6">
      <button className="btn btn-secondary" onClick={onGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate with AI"}
      </button>
      <button className="btn btn-primary" onClick={onSave} disabled={!canSave || loading}>
        Save Integration
      </button>
    </div>
  )
}
