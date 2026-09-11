"use client";

import { FormEvent, useState } from "react";

import { askAssistant } from "../../../lib/api";
import Sidebar from "../components/Sidebar";

const suggestions = [
  "Explain process scheduling in simple terms",
  "Quiz me on cache memory",
  "Help me plan what to study tonight",
];

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
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
    setResponse("");

    try {
      const data = await askAssistant(trimmedMessage);
      setResponse(data.response);
    } catch {
      setError("CampusMind AI is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  function useSuggestion(suggestion: string) {
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
              Ask questions and get help grounded in your courses and study
              material.
            </p>
          </div>
        </section>

        <section className="assistant-layout">
          <div className="assistant-chat">
            <div className="assistant-message">
              <p className="card-label">CAMPUSMIND AI</p>

              <h2>What are we working on?</h2>

              <p>
                I can explain concepts, help you study, create practice
                questions, or help organize your academic work.
              </p>
            </div>

            <div className="assistant-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => useSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {response && (
              <div className="assistant-response">
                <p className="card-label">RESPONSE</p>
                <p>{response}</p>
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

            <h2>Your courses</h2>

            <div className="context-course">
              <span>CS 3013</span>
              <strong>Operating Systems</strong>
            </div>

            <div className="context-course">
              <span>CS 3023</span>
              <strong>Computer Architecture</strong>
            </div>

            <div className="context-course">
              <span>CS 3203</span>
              <strong>Software Design & Development</strong>
            </div>

            <p className="context-note">
              Later, CampusMind will use your actual course material to provide
              more relevant answers.
            </p>
          </aside>
        </section>
      </main>
    </div>
  );
}