import { getCourses } from "../../../lib/api";
import Sidebar from "../components/Sidebar";

export default async function CoursesPage() {
  const courses = await getCourses();

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