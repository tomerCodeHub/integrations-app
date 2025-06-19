"use client";

import { useState } from "react";
import EditIntegrationModal from "./EditIntegraionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import IntegrationDetailsModal from "./IntegrationDetailsModal";
import { supabase } from "@/lib/supabaseClient";
import { Integration } from "@/types";

interface Props {
  integrations: Integration[];
  setIntegrations: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function IntegrationTable({
  integrations,
  setIntegrations,
}: Props) {
  const [selectedIntegration, setSelectedIntegration] = useState<any | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [viewTarget, setViewTarget] = useState<any | null>(null); //  for viewing details
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("id", deleteTarget.id);

    if (!error) {
      setIntegrations((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    } else {
      console.error("Failed to delete:", error.message);
    }

    setDeleting(false);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra w-full">
          <thead className="bg-base-300">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((i) => (
              <tr
                key={i.id}
                className="cursor-pointer hover:bg-slate-200 transition"
                onClick={(e) => {
                  // Don't trigger modal if Edit/Delete buttons were clicked
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("button") // check if click is inside a button
                  )
                    return;

                  setViewTarget(i); // open the view modal
                }}
              >
                <td>{i.name}</td>
                <td>{i.integration_type}</td>
                <td>{new Date(i.created_at).toLocaleDateString()}</td>
                <td className="text-right space-x-2">
                  <button
                    className="btn btn-sm btn-outline btn-info"
                    onClick={() => setSelectedIntegration(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => setDeleteTarget(i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedIntegration && (
        <EditIntegrationModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onSave={(updated) => {
            setIntegrations((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i))
            );
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirmationModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}

      {/* View Details Modal */}
      {viewTarget && (
        <IntegrationDetailsModal
          integration={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
    </>
  );
}
