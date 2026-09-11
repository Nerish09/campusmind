import Sidebar from "../components/Sidebar";

const assignments = [
  {
    course: "Operating Systems",
    title: "Process Scheduling Lab",
    due: "Tomorrow",
    priority: "High",
    status: "In progress",
  },
  {
    course: "Computer Architecture",
    title: "Cache Memory Worksheet",
    due: "Friday",
    priority: "Medium",
    status: "Not started",
  },
  {
    course: "Software Design & Development",
    title: "Sprint Retrospective",
    due: "Next Monday",
    priority: "Low",
    status: "Complete",
  },
];

export default function AssignmentsPage() {
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
                  {assignment.priority} priority
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