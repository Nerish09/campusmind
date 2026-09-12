"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  createStudySession,
  getCourses,
  getStudySessions,
  updateStudySessionStatus,
  Course,
  StudySession,
} from "../../../lib/api";
import Sidebar from "../components/Sidebar";

export default function StudyPage() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [courseId, setCourseId] = useState<number>(0);
  const [topic, setTopic] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);

  const [loading, setLoading] = useState(false);
  const [updatingSessionId, setUpdatingSessionId] = useState<number | null>(
    null
  );
  const [error, setError] = useState("");

  async function loadStudySessions() {
    try {
      const data = await getStudySessions();
      setStudySessions(data);
    } catch {
      setError("Failed to load study sessions.");
    }
  }

  async function loadCourses() {
    try {
      const data = await getCourses();
      setCourses(data);

      if (data.length > 0) {
        setCourseId(data[0].id);
      }
    } catch {
      setError("Failed to load courses.");
    }
  }

  useEffect(() => {
    loadStudySessions();
    loadCourses();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!topic.trim() || courseId === 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createStudySession({
        course_id: courseId,
        topic: topic.trim(),
        duration_minutes: durationMinutes,
        status: "Planned",
      });

      setTopic("");
      setDurationMinutes(30);
      setShowForm(false);

      await loadStudySessions();
    } catch {
      setError("Failed to create study session.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(
    sessionId: number,
    newStatus: string
  ) {
    setUpdatingSessionId(sessionId);
    setError("");

    try {
      await updateStudySessionStatus(sessionId, newStatus);
      await loadStudySessions();
    } catch {
      setError("Failed to update study session.");
    } finally {
      setUpdatingSessionId(null);
    }
  }

  // Calculate real metrics from our study-session data.
  const completedSessions = studySessions.filter(
    (session) => session.status === "Completed"
  );

  const completedMinutes = completedSessions.reduce((total, session) => {
    const minutes = Number.parseInt(session.duration, 10);

    return total + (Number.isNaN(minutes) ? 0 : minutes);
  }, 0);

  const completedHours = (completedMinutes / 60).toFixed(1);

  const inProgressCount = studySessions.filter(
    (session) => session.status === "In progress"
  ).length;

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
            <p className="card-label">COMPLETED TIME</p>
            <h2>{completedHours} hours</h2>
            <p>Total time from completed study sessions.</p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">SESSIONS</p>
            <h2>{studySessions.length}</h2>
            <p>Total study sessions currently tracked.</p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">IN PROGRESS</p>
            <h2>{inProgressCount}</h2>
            <p>Study sessions currently in progress.</p>
          </article>
        </section>

        <section className="study-section">
          <div className="study-section-header">
            <div>
              <p className="card-label">RECENT SESSIONS</p>
              <h2>Study activity</h2>
            </div>

            <button
              type="button"
              onClick={() => setShowForm((current) => !current)}
            >
              {showForm ? "Cancel" : "Start study session"}
            </button>
          </div>

          {showForm && (
            <form className="study-form" onSubmit={handleSubmit}>
              <div className="study-form-field">
                <label htmlFor="course">Course</label>

                <select
                  id="course"
                  value={courseId}
                  onChange={(event) =>
                    setCourseId(Number(event.target.value))
                  }
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="study-form-field">
                <label htmlFor="topic">Topic</label>

                <input
                  id="topic"
                  type="text"
                  placeholder="Example: Virtual Memory"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                />
              </div>

              <div className="study-form-field">
                <label htmlFor="duration">Duration</label>

                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(event) =>
                    setDurationMinutes(Number(event.target.value))
                  }
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create session"}
              </button>
            </form>
          )}

          {error && <p className="study-error">{error}</p>}

          <div className="study-session-list">
            {studySessions.map((session) => (
              <article className="study-session-card" key={session.id}>
                <div>
                  <p className="card-label">{session.subject}</p>
                  <h3>{session.topic}</h3>
                </div>

                <div className="study-session-meta">
                  <span>{session.duration}</span>

                  <span className="assignment-status">
                    {session.status}
                  </span>

                  {session.status === "Planned" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(session.id, "In progress")
                      }
                      disabled={updatingSessionId === session.id}
                    >
                      {updatingSessionId === session.id
                        ? "Starting..."
                        : "Start"}
                    </button>
                  )}

                  {session.status === "In progress" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(session.id, "Completed")
                      }
                      disabled={updatingSessionId === session.id}
                    >
                      {updatingSessionId === session.id
                        ? "Completing..."
                        : "Complete"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}