import { getStudySessions } from "../../../lib/api";
import Sidebar from "../components/Sidebar";

export default async function StudyPage() {
  const studySessions = await getStudySessions();

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
            <h2>{studySessions.length}</h2>
            <p>Study sessions currently tracked.</p>
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