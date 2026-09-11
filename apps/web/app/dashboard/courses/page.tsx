import Sidebar from "../components/Sidebar";

const courses = [
  {
    code: "CS 3013",
    name: "Operating Systems",
    instructor: "Dr. Carter",
    progress: 68,
  },
  {
    code: "CS 3023",
    name: "Computer Architecture",
    instructor: "Dr. Nguyen",
    progress: 54,
  },
  {
    code: "CS 3203",
    name: "Software Design & Development",
    instructor: "Dr. Patel",
    progress: 76,
  },
];

export default function CoursesPage() {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">COURSES</p>
            <h1>Your semester</h1>
            <p className="dashboard-subtitle">
              Keep track of classes, progress, and course activity.
            </p>
          </div>
        </section>

        <section className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course.code}>
              <div>
                <p className="card-label">{course.code}</p>
                <h2>{course.name}</h2>
                <p>{course.instructor}</p>
              </div>

              <div className="course-progress">
                <div className="course-progress-header">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}