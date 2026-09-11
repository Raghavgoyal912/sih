"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-surface-container rounded-xl shadow-sm p-6 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-primary">Sign in to BhoomiSetu</h1>
          <p className="text-xs text-on-surface-variant">
            National Digital Platform for Land Governance
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 rounded-lg border border-surface-container text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-surface-container" />
          <span className="text-[11px] text-on-surface-variant">OR</span>
          <div className="flex-1 h-px bg-surface-container" />
        </div>

        {status !== "sent" && (
          <form onSubmit={handleSendLink} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg border border-surface-container bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Sending link..." : "Send login link"}
            </button>
          </form>
        )}

        {status === "sent" && (
          <div className="text-center space-y-2">
            <span className="material-symbols-outlined text-[32px] text-secondary">mail</span>
            <p className="text-sm text-on-surface">
              Check <span className="font-semibold">{email}</span> and click the link inside to
              finish signing in.
            </p>
            <p className="text-xs text-on-surface-variant">
              You can close this tab — the link will bring you back here signed in.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="text-xs text-secondary hover:underline"
            >
              Use a different email
            </button>
          </div>
        )}

        {status === "error" && errorMessage && (
          <p className="text-xs text-red-600 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}