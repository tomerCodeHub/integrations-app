'use client'

interface Props {
  name: string                     // For showing the integration name
  onConfirm: () => void            // Called when user confirms deletion
  onCancel: () => void             // Closes the modal
  loading?: boolean                // Optional: show spinner on delete
}

/**
 * A simple confirmation modal that asks if user really wants to delete.
 */
export default function DeleteConfirmationModal({ name, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Delete Integration</h2>
        <p className="mb-6">Are you sure you want to delete <strong>{name}</strong>?</p>

        <div className="flex justify-end gap-3">
          <button className="btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
