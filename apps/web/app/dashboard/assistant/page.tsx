"use client";

import { FormEvent, useState } from "react";

import { askAssistant } from "../../../lib/api";
import Sidebar from "../components/Sidebar";

const suggestions = [
  "What should I study today?",
  "Which assignment should I prioritize?",
  "Help me plan my study session.",
];

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setLoading(true);
    setError("");
    setReply("");

    try {
      const data = await askAssistant(trimmedMessage);
      setReply(data.reply);
    } catch {
      setError("CampusMind AI is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(suggestion: string) {
    setMessage(suggestion);
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">AI ASSISTANT</p>
            <h1>Study with CampusMind AI</h1>
            <p className="dashboard-subtitle">
              Ask questions and get help organizing your academic work.
            </p>
          </div>
        </section>

        <section className="assistant-layout">
          <div className="assistant-chat">
            <div className="assistant-message">
              <p className="card-label">CAMPUSMIND AI</p>
              <h2>What are we working on?</h2>

              <p>
                I can help you decide what to study, prioritize assignments,
                and organize your coursework.
              </p>
            </div>

            <div className="assistant-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {reply && (
              <div className="assistant-response">
                <p className="card-label">CAMPUSMIND AI</p>
                <p>{reply}</p>
              </div>
            )}

            {error && (
              <div className="assistant-response">
                <p className="card-label">ERROR</p>
                <p>{error}</p>
              </div>
            )}

            <form className="assistant-input" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ask CampusMind anything..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Thinking..." : "Send"}
              </button>
            </form>
          </div>

          <aside className="assistant-context">
            <p className="card-label">ACADEMIC CONTEXT</p>

            <h2>CampusMind AI</h2>

            <p className="context-note">
              This version is connected to your FastAPI backend. Next, we can
              make it use your actual courses, assignments, and study sessions
              from PostgreSQL when answering.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}