import Sidebar from "./components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Good morning, Nerish.</h1>
            <p className="dashboard-subtitle">
              Here’s what needs your attention today.
            </p>
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card">
            <p className="card-label">Upcoming</p>
            <h2>3 deadlines</h2>
            <p>You have three important academic items due soon.</p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">Study time</p>
            <h2>4.5 hours</h2>
            <p>Focused study time tracked this week.</p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">Courses</p>
            <h2>5 active</h2>
            <p>Your current semester courses will appear here.</p>
          </article>
        </section>

        <section className="priority-section">
          <div>
            <p className="card-label">Top priority</p>
            <h2>Operating Systems — Process Scheduling</h2>
            <p>Due tomorrow · High priority</p>
          </div>

          <button>Open assignment</button>
        </section>
      </main>
    </div>
  );
}