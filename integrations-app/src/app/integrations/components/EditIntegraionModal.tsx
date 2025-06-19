"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Integration } from "@/types";

interface Props {
  integration: Integration | null; // The integration to edit
  onClose: () => void; // Close the modal
  onSave: (updated: any) => void; // Callback after successful update
}

/**
 * Modal for editing an existing integration.
 * Prefills the form, updates the DB on submit, and calls onSave.
 */
export default function EditIntegrationModal({
  integration,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    api_docs_url: "",
    config_example: "",
    integration_type: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // When integration changes, populate the form fields
  useEffect(() => {
    if (integration) {
      setForm({
        name: integration.name || "",
        description: integration.description || "",
        api_docs_url: integration.api_docs_url || "",
        config_example: integration.config_example || "",
        integration_type: integration.integration_type || "",
      });
    }
  }, [integration]);

  const handleUpdate = async () => {
    if (!integration?.id) return;

    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("integrations")
      .update(form)
      .eq("id", integration.id);

    if (error) {
      setError(error.message);
    } else {
      onSave({ ...integration, ...form }); //  pass the updated integration
      onClose();
    }

    setLoading(false);
  };

  if (!integration) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded shadow-md w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Edit Integration</h2>

        {error && <div className="alert alert-error mb-2">{error}</div>}

        {/* Form Inputs */}
        <div className="form-control mb-3">
          <label className="label pr-18">Name</label>
          <input
            className="input input-bordered"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-control mb-3">
          <label className="label pr-9">Description</label>
          <textarea
            className="textarea textarea-bordered"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-control mb-3">
          <label className="label pr-3">API Docs URL</label>
          <input
            className="input input-bordered"
            value={form.api_docs_url}
            onChange={(e) => setForm({ ...form, api_docs_url: e.target.value })}
          />
        </div>

        <div className="form-control mb-3">
          <label className="label pr-1">Config Example</label>
          <textarea
            className="textarea textarea-bordered"
            value={form.config_example}
            onChange={(e) =>
              setForm({ ...form, config_example: e.target.value })
            }
          />
        </div>

        <div className="form-control mb-3">
          <label className="label pr-1">Integration Type</label>
          <select
            className="select select-bordered"
            value={form.integration_type}
            onChange={(e) =>
              setForm({ ...form, integration_type: e.target.value })
            }
          >
            <option value="">Select type</option>
            <option value="Email">Email</option>
            <option value="Messaging">Messaging</option>
            <option value="Billing">Billing</option>
            <option value="Chat">Chat</option>
            <option value="CRM">CRM</option>
            <option value="Payment">Payment</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
