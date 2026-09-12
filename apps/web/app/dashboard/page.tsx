"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Assignment,
  Course,
  StudySession,
  getAssignments,
  getCourses,
  getStudySessions,
} from "../../lib/api";

import Sidebar from "./components/Sidebar";

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboardData() {
    setLoading(true);
    setError("");

    try {
      const [courseData, assignmentData, studyData] = await Promise.all([
        getCourses(),
        getAssignments(),
        getStudySessions(),
      ]);

      setCourses(courseData);
      setAssignments(assignmentData);
      setStudySessions(studyData);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const completedMinutes = useMemo(() => {
    return studySessions
      .filter((session) => session.status === "Completed")
      .reduce((total, session) => {
        const minutes = Number.parseInt(session.duration, 10);

        return total + (Number.isNaN(minutes) ? 0 : minutes);
      }, 0);
  }, [studySessions]);

  const completedHours = (completedMinutes / 60).toFixed(1);

  const activeCourses = courses.length;

  const topPriorityAssignment = useMemo(() => {
    const incompleteAssignments = assignments.filter(
      (assignment) => assignment.status !== "Complete"
    );

    const highPriorityAssignment = incompleteAssignments.find(
      (assignment) => assignment.priority === "High priority"
    );

    return highPriorityAssignment ?? incompleteAssignments[0] ?? null;
  }, [assignments]);

  const averageProgress = useMemo(() => {
    if (courses.length === 0) {
      return 0;
    }

    const total = courses.reduce(
      (sum, course) => sum + course.progress,
      0
    );

    return Math.round(total / courses.length);
  }, [courses]);

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">DASHBOARD</p>
            <h1>Welcome back</h1>
            <p className="dashboard-subtitle">
              Here&apos;s what&apos;s happening across your semester.
            </p>
          </div>
        </section>

        {loading && (
          <p className="dashboard-subtitle">
            Loading CampusMind data...
          </p>
        )}

        {error && (
          <p className="study-error">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <section className="dashboard-grid">
              <article className="dashboard-card">
                <p className="card-label">STUDY TIME</p>
                <h2>{completedHours} hours</h2>
                <p>Completed focused study time.</p>
              </article>

              <article className="dashboard-card">
                <p className="card-label">COURSES</p>
                <h2>{activeCourses} active</h2>
                <p>Your current semester courses.</p>
              </article>

              <article className="dashboard-card">
                <p className="card-label">AVERAGE PROGRESS</p>
                <h2>{averageProgress}%</h2>
                <p>Average progress across all courses.</p>
              </article>
            </section>

            <section className="priority-section">
              <div>
                <p className="card-label">TOP PRIORITY</p>

                {topPriorityAssignment ? (
                  <>
                    <h2>
                      {topPriorityAssignment.course} —{" "}
                      {topPriorityAssignment.title}
                    </h2>

                    <p>
                      Due {topPriorityAssignment.due} ·{" "}
                      {topPriorityAssignment.priority}
                    </p>
                  </>
                ) : (
                  <>
                    <h2>No pending assignments</h2>
                    <p>You&apos;re caught up.</p>
                  </>
                )}
              </div>

              <a href="/dashboard/assignments">
                <button type="button">
                  Open assignments
                </button>
              </a>
            </section>
          </>
        )}
      </main>
    </div>
  );
}