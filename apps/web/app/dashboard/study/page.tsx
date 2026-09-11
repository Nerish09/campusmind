import Sidebar from "../components/Sidebar";

const studySessions = [
  {
    subject: "Operating Systems",
    topic: "CPU Scheduling",
    duration: "50 min",
    status: "Completed",
  },
  {
    subject: "Computer Architecture",
    topic: "Cache Mapping",
    duration: "35 min",
    status: "Completed",
  },
  {
    subject: "Software Design & Development",
    topic: "Design Patterns",
    duration: "60 min",
    status: "Planned",
  },
];

export default function StudyPage() {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">STUDY</p>
            <h1>Build better study habits</h1>
            <p className="dashboard-subtitle">
              Track focused sessions and see where your time is going.
            </p>
          </div>
        </section>

        <section className="study-summary-grid">
          <article className="dashboard-card">
            <p className="card-label">This week</p>
            <h2>4.5 hours</h2>
            <p>Total focused study time.</p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">Sessions</p>
            <h2>6</h2>
            <p>Completed study sessions this week.</p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">Best streak</p>
            <h2>4 days</h2>
            <p>Longest active study streak.</p>
          </article>
        </section>

        <section className="study-section">
          <div className="study-section-header">
            <div>
              <p className="card-label">Recent sessions</p>
              <h2>Study activity</h2>
            </div>

            <button>Start study session</button>
          </div>

          <div className="study-session-list">
            {studySessions.map((session) => (
              <article
                className="study-session-card"
                key={`${session.subject}-${session.topic}`}
              >
                <div>
                  <p className="card-label">{session.subject}</p>
                  <h3>{session.topic}</h3>
                </div>

                <div className="study-session-meta">
                  <span>{session.duration}</span>
                  <span className="assignment-status">{session.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}