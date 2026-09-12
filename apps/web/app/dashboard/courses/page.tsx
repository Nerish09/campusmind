"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Course,
  createCourse,
  getCourses,
} from "../../../lib/api";

import Sidebar from "../components/Sidebar";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [progress, setProgress] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadCourses() {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch {
      setError("Failed to load courses.");
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!code.trim() || !name.trim() || !instructor.trim()) {
      setError("Please complete all course fields.");
      return;
    }

    if (progress < 0 || progress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createCourse({
        code: code.trim(),
        name: name.trim(),
        instructor: instructor.trim(),
        progress,
      });

      setCode("");
      setName("");
      setInstructor("");
      setProgress(0);
      setShowForm(false);

      await loadCourses();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create course.");
      }
    } finally {
      setLoading(false);
    }
  }

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

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
          >
            {showForm ? "Cancel" : "Add course"}
          </button>
        </section>

        {showForm && (
          <section className="study-section">
            <form className="study-form" onSubmit={handleSubmit}>
              <div className="study-form-field">
                <label htmlFor="course-code">Course code</label>

                <input
                  id="course-code"
                  type="text"
                  placeholder="Example: CS 3501"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
              </div>

              <div className="study-form-field">
                <label htmlFor="course-name">Course name</label>

                <input
                  id="course-name"
                  type="text"
                  placeholder="Example: Software Testing"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="study-form-field">
                <label htmlFor="course-instructor">Instructor</label>

                <input
                  id="course-instructor"
                  type="text"
                  placeholder="Example: Dr. Lee"
                  value={instructor}
                  onChange={(event) => setInstructor(event.target.value)}
                />
              </div>

              <div className="study-form-field">
                <label htmlFor="course-progress">Progress</label>

                <input
                  id="course-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) =>
                    setProgress(Number(event.target.value))
                  }
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create course"}
              </button>
            </form>
          </section>
        )}

        {error && <p className="study-error">{error}</p>}

        <section className="courses-grid">
          {courses.map((course) => (
            <article className="dashboard-card course-card" key={course.id}>
              <p className="card-label">{course.code}</p>

              <h2>{course.name}</h2>

              <p>{course.instructor}</p>

              <div className="course-progress-row">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>

              <div className="course-progress-track">
                <div
                  className="course-progress-fill"
                  style={{
                    width: `${course.progress}%`,
                  }}
                />
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}