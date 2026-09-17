"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type Workspace = {
  id: string;
  name: string;
  description: string;
  is_private: boolean;
  created_at: string;
};

export default function CollaborationHubPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsPrivate, setNewIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadWorkspaces = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/workspaces`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to load workspaces (${res.status})`);
      }
      const data = await res.json();
      setWorkspaces(data.workspaces || []);
      setStatus("idle");
    } catch (err: any) {
      console.error("Workspaces error:", err);
      setErrorMessage(err.message || "Could not load workspaces. Is the backend running?");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch(`${API_BASE}/api/workspaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          isPrivate: newIsPrivate,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to create workspace (${res.status})`);
      }
      setNewName("");
      setNewDescription("");
      setNewIsPrivate(false);
      setShowCreateForm(false);
      await loadWorkspaces();
    } catch (err: any) {
      console.error("Create workspace error:", err);
      setCreateError(err.message || "Could not create workspace.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this workspace? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE}/api/workspaces/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete workspace.");
    }
  };

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-6rem)]">
      <div className="max-w-[88rem] mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight font-serif">
              Collaboration Hub
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Shared workspaces for cross-agency land governance research and coordination.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Workspace
          </button>
        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 p-5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm space-y-3"
          >
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Workspace name (e.g. 'Sonipat Boundary Review')"
              className="w-full px-3 py-2 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description (optional)"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-surface-container bg-surface-container-low text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <label className="flex items-center gap-2 text-xs text-on-surface-variant">
              <input
                type="checkbox"
                checked={newIsPrivate}
                onChange={(e) => setNewIsPrivate(e.target.checked)}
                className="rounded"
              />
              Mark as private (label only — visibility control coming later)
            </label>
            {createError && <p className="text-xs text-red-600">{createError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Workspace"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {status === "loading" && (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading workspaces...</div>
        )}

        {status === "error" && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            {errorMessage}
          </div>
        )}

        {status === "idle" && workspaces.length === 0 && (
          <div className="p-8 rounded-xl bg-surface-container-lowest border border-surface-container text-center text-sm text-on-surface-variant">
            No workspaces yet. Create the first one above.
          </div>
        )}

        {status === "idle" && workspaces.length > 0 && (
          <div className="space-y-3">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-primary">{ws.name}</h3>
                    {ws.is_private && (
                      <span className="text-[10px] font-semibold bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">
                        Private
                      </span>
                    )}
                  </div>
                  {ws.description && (
                    <p className="text-xs text-on-surface-variant mt-1">{ws.description}</p>
                  )}
                  <p className="text-[10px] text-on-surface-variant mt-2">
                    Created {new Date(ws.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(ws.id)}
                  className="text-xs text-red-600 hover:underline shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}