import { getAssignments } from "../../../lib/api";
import Sidebar from "../components/Sidebar";

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">ASSIGNMENTS</p>
            <h1>Stay ahead of deadlines</h1>
            <p className="dashboard-subtitle">
              Track coursework, due dates, priorities, and progress.
            </p>
          </div>
        </section>

        <section className="assignment-list">
          {assignments.map((assignment) => (
            <article
              className="assignment-card"
              key={`${assignment.course}-${assignment.title}`}
            >
              <div className="assignment-main">
                <p className="card-label">{assignment.course}</p>
                <h2>{assignment.title}</h2>
                <p className="assignment-due">Due {assignment.due}</p>
              </div>

              <div className="assignment-meta">
                <span className="assignment-pill">
                  {assignment.priority}
                </span>

                <span className="assignment-status">
                  {assignment.status}
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}