import Sidebar from "../components/Sidebar";

const suggestions = [
  "Explain process scheduling in simple terms",
  "Quiz me on cache memory",
  "Help me plan what to study tonight",
];

export default function AssistantPage() {
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
                <button key={suggestion}>{suggestion}</button>
              ))}
            </div>

            <div className="assistant-input">
              <input
                type="text"
                placeholder="Ask CampusMind anything..."
              />

              <button type="button">Send</button>
            </div>
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