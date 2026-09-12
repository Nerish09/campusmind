"use client";

import {
  CSSProperties,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Course,
  StudySession,
  createStudySession,
  deleteStudySession,
  getCourses,
  getStudySessions,
  updateStudySession,
  updateStudySessionStatus,
} from "../../../lib/api";

import Sidebar from "../components/Sidebar";

const statuses = [
  "Planned",
  "In progress",
  "Completed",
];

export default function StudyPage() {
  const [studySessions, setStudySessions] =
    useState<StudySession[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [courseId, setCourseId] =
    useState<number>(0);

  const [topic, setTopic] =
    useState("");

  const [durationMinutes, setDurationMinutes] =
    useState(30);

  const [
    editingSessionId,
    setEditingSessionId,
  ] = useState<number | null>(null);

  const [editCourseId, setEditCourseId] =
    useState<number>(0);

  const [editTopic, setEditTopic] =
    useState("");

  const [
    editDurationMinutes,
    setEditDurationMinutes,
  ] = useState(30);

  const [editStatus, setEditStatus] =
    useState("Planned");

  const [loading, setLoading] =
    useState(false);

  const [
    updatingSessionId,
    setUpdatingSessionId,
  ] = useState<number | null>(null);

  const [
    deletingSessionId,
    setDeletingSessionId,
  ] = useState<number | null>(null);

  const [error, setError] =
    useState("");

  async function loadStudySessions() {
    try {
      const data =
        await getStudySessions();

      setStudySessions(data);
    } catch {
      setError(
        "Failed to load study sessions."
      );
    }
  }

  async function loadCourses() {
    try {
      const data =
        await getCourses();

      setCourses(data);

      if (data.length > 0) {
        setCourseId((current) =>
          current === 0
            ? data[0].id
            : current
        );
      }
    } catch {
      setError(
        "Failed to load courses."
      );
    }
  }

  useEffect(() => {
    loadStudySessions();
    loadCourses();
  }, []);

  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      courseId === 0 ||
      !topic.trim() ||
      durationMinutes <= 0
    ) {
      setError(
        "Please complete all study session fields."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      await createStudySession({
        course_id: courseId,
        topic: topic.trim(),
        duration_minutes:
          durationMinutes,
        status: "Planned",
      });

      setTopic("");
      setDurationMinutes(30);
      setShowForm(false);

      await loadStudySessions();
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(error.message);
      } else {
        setError(
          "Failed to create study session."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function startEditing(
    session: StudySession
  ) {
    setEditingSessionId(
      session.id
    );

    setEditCourseId(
      session.course_id
    );

    setEditTopic(
      session.topic
    );

    setEditDurationMinutes(
      session.duration_minutes
    );

    setEditStatus(
      session.status
    );

    setError("");
  }

  function cancelEditing() {
    setEditingSessionId(null);
    setError("");
  }

  async function handleUpdate(
    event:
      FormEvent<HTMLFormElement>,
    sessionId: number
  ) {
    event.preventDefault();

    if (
      editCourseId === 0 ||
      !editTopic.trim() ||
      editDurationMinutes <= 0
    ) {
      setError(
        "Please complete all study session fields."
      );

      return;
    }

    setUpdatingSessionId(
      sessionId
    );

    setError("");

    try {
      await updateStudySession(
        sessionId,
        {
          course_id:
            editCourseId,

          topic:
            editTopic.trim(),

          duration_minutes:
            editDurationMinutes,

          status:
            editStatus,
        }
      );

      setEditingSessionId(
        null
      );

      await loadStudySessions();
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(
          error.message
        );
      } else {
        setError(
          "Failed to update study session."
        );
      }
    } finally {
      setUpdatingSessionId(
        null
      );
    }
  }

  async function handleStatusUpdate(
    sessionId: number,
    newStatus: string
  ) {
    setUpdatingSessionId(
      sessionId
    );

    setError("");

    try {
      await updateStudySessionStatus(
        sessionId,
        newStatus
      );

      await loadStudySessions();
    } catch {
      setError(
        "Failed to update study session."
      );
    } finally {
      setUpdatingSessionId(
        null
      );
    }
  }

  async function handleDelete(
    session: StudySession
  ) {
    const confirmed =
      window.confirm(
        `Delete "${session.topic}" from ${session.subject}?`
      );

    if (!confirmed) {
      return;
    }

    setDeletingSessionId(
      session.id
    );

    setError("");

    try {
      await deleteStudySession(
        session.id
      );

      await loadStudySessions();
    } catch {
      setError(
        "Failed to delete study session."
      );
    } finally {
      setDeletingSessionId(
        null
      );
    }
  }

  const completedSessions =
    studySessions.filter(
      (session) =>
        session.status ===
        "Completed"
    );

  const completedMinutes =
    completedSessions.reduce(
      (total, session) =>
        total +
        session.duration_minutes,
      0
    );

  const completedHours =
    (
      completedMinutes / 60
    ).toFixed(1);

  const inProgressCount =
    studySessions.filter(
      (session) =>
        session.status ===
        "In progress"
    ).length;

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">
              STUDY
            </p>

            <h1>
              Build better study habits
            </h1>

            <p className="dashboard-subtitle">
              Track focused sessions
              and see where your time
              is going.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(
                (current) =>
                  !current
              );

              setError("");
            }}
          >
            {showForm
              ? "Cancel"
              : "Start study session"}
          </button>
        </section>

        <section className="study-summary-grid">
          <article className="dashboard-card">
            <p className="card-label">
              COMPLETED TIME
            </p>

            <h2>
              {completedHours} hours
            </h2>

            <p>
              Total time from completed
              study sessions.
            </p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">
              SESSIONS
            </p>

            <h2>
              {studySessions.length}
            </h2>

            <p>
              Total study sessions
              currently tracked.
            </p>
          </article>

          <article className="dashboard-card">
            <p className="card-label">
              IN PROGRESS
            </p>

            <h2>
              {inProgressCount}
            </h2>

            <p>
              Study sessions currently
              in progress.
            </p>
          </article>
        </section>

        <section className="study-section">
          <div className="study-section-header">
            <div>
              <p className="card-label">
                RECENT SESSIONS
              </p>

              <h2>
                Study activity
              </h2>
            </div>
          </div>

          {showForm && (
            <form
              className="study-form"
              onSubmit={
                handleCreate
              }
            >
              <div className="study-form-field">
                <label
                  htmlFor="study-course"
                >
                  Course
                </label>

                <select
                  id="study-course"
                  value={
                    courseId
                  }
                  onChange={(
                    event
                  ) =>
                    setCourseId(
                      Number(
                        event
                          .target
                          .value
                      )
                    )
                  }
                >
                  {courses.map(
                    (course) => (
                      <option
                        key={
                          course.id
                        }
                        value={
                          course.id
                        }
                      >
                        {
                          course.code
                        }{" "}
                        —{" "}
                        {
                          course.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="study-form-field">
                <label
                  htmlFor="study-topic"
                >
                  Topic
                </label>

                <input
                  id="study-topic"
                  type="text"
                  placeholder="Example: Virtual Memory"
                  value={topic}
                  onChange={(
                    event
                  ) =>
                    setTopic(
                      event
                        .target
                        .value
                    )
                  }
                />
              </div>

              <div className="study-form-field">
                <div className="course-edit-progress-header">
                  <label
                    htmlFor="study-duration"
                  >
                    Duration
                  </label>

                  <span>
                    {
                      durationMinutes
                    }{" "}
                    min
                  </span>
                </div>

                <input
                  id="study-duration"
                  className="course-progress-slider"
                  type="range"
                  min="15"
                  max="180"
                  step="5"
                  value={
                    durationMinutes
                  }
                  style={
                    {
                      "--progress": `${
                        ((
                          durationMinutes -
                          15
                        ) /
                          (180 -
                            15)) *
                        100
                      }%`,
                    } as CSSProperties
                  }
                  onChange={(
                    event
                  ) =>
                    setDurationMinutes(
                      Number(
                        event
                          .target
                          .value
                      )
                    )
                  }
                />

                <div className="course-edit-progress-scale">
                  <span>
                    15 min
                  </span>

                  <span>
                    90 min
                  </span>

                  <span>
                    180 min
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading
                }
              >
                {loading
                  ? "Creating..."
                  : "Create session"}
              </button>
            </form>
          )}

          {error && (
            <p className="study-error">
              {error}
            </p>
          )}

          <div className="study-session-list">
            {studySessions.map(
              (session) => {
                const isEditing =
                  editingSessionId ===
                  session.id;

                return (
                  <article
                    className="study-session-card"
                    key={
                      session.id
                    }
                  >
                    {isEditing ? (
                      <form
                        className="study-edit-card"
                        onSubmit={(
                          event
                        ) =>
                          handleUpdate(
                            event,
                            session.id
                          )
                        }
                      >
                        <div className="study-edit-heading">
                          <div>
                            <p className="card-label">
                              EDIT STUDY SESSION
                            </p>

                            <h3>
                              Study activity
                            </h3>
                          </div>
                        </div>

                        <div className="study-edit-grid">
                          <div className="study-edit-field">
                            <label>
                              Course
                            </label>

                            <select
                              value={
                                editCourseId
                              }
                              onChange={(
                                event
                              ) =>
                                setEditCourseId(
                                  Number(
                                    event
                                      .target
                                      .value
                                  )
                                )
                              }
                            >
                              {courses.map(
                                (
                                  course
                                ) => (
                                  <option
                                    key={
                                      course.id
                                    }
                                    value={
                                      course.id
                                    }
                                  >
                                    {
                                      course.code
                                    }{" "}
                                    —{" "}
                                    {
                                      course.name
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <span className="study-edit-help">
                              Select the
                              course for this
                              session
                            </span>
                          </div>

                          <div className="study-edit-field">
                            <label>
                              Topic
                            </label>

                            <input
                              type="text"
                              value={
                                editTopic
                              }
                              onChange={(
                                event
                              ) =>
                                setEditTopic(
                                  event
                                    .target
                                    .value
                                )
                              }
                            />

                            <span className="study-edit-help">
                              What are you
                              studying?
                            </span>
                          </div>

                          <div className="study-edit-field study-edit-duration">
                            <div className="study-edit-duration-header">
                              <label>
                                Duration
                              </label>

                              <span className="study-edit-duration-value">
                                {
                                  editDurationMinutes
                                }{" "}
                                min
                              </span>
                            </div>

                            <input
                              className="study-duration-slider"
                              type="range"
                              min="15"
                              max="180"
                              step="5"
                              value={
                                editDurationMinutes
                              }
                              style={
                                {
                                  "--progress": `${
                                    ((
                                      editDurationMinutes -
                                      15
                                    ) /
                                      (180 -
                                        15)) *
                                    100
                                  }%`,
                                } as CSSProperties
                              }
                              onChange={(
                                event
                              ) =>
                                setEditDurationMinutes(
                                  Number(
                                    event
                                      .target
                                      .value
                                  )
                                )
                              }
                            />

                            <div className="study-duration-scale">
                              <span>
                                15
                              </span>

                              <span>
                                60
                              </span>

                              <span>
                                120
                              </span>

                              <span>
                                180
                              </span>
                            </div>

                            <span className="study-edit-help">
                              How long did you
                              study?
                            </span>
                          </div>

                          <div className="study-edit-field">
                            <label>
                              Status
                            </label>

                            <select
                              value={
                                editStatus
                              }
                              onChange={(
                                event
                              ) =>
                                setEditStatus(
                                  event
                                    .target
                                    .value
                                )
                              }
                            >
                              {statuses.map(
                                (item) => (
                                  <option
                                    key={
                                      item
                                    }
                                    value={
                                      item
                                    }
                                  >
                                    {
                                      item
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <span className="study-edit-help">
                              Current status
                              of this session
                            </span>
                          </div>
                        </div>

                        <div className="study-edit-footer">
                          <button
                            type="submit"
                            className="study-save-button"
                            disabled={
                              updatingSessionId ===
                              session.id
                            }
                          >
                            {updatingSessionId ===
                            session.id
                              ? "Saving..."
                              : "Save changes"}
                          </button>

                          <button
                            type="button"
                            className="study-cancel-button"
                            onClick={
                              cancelEditing
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div>
                          <p className="card-label">
                            {
                              session.subject
                            }
                          </p>

                          <h3>
                            {
                              session.topic
                            }
                          </h3>
                        </div>

                        <div className="study-session-meta">
                          <span>
                            {
                              session.duration
                            }
                          </span>

                          <span className="assignment-status">
                            {
                              session.status
                            }
                          </span>

                          {session.status ===
                            "Planned" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(
                                  session.id,
                                  "In progress"
                                )
                              }
                              disabled={
                                updatingSessionId ===
                                session.id
                              }
                            >
                              {updatingSessionId ===
                              session.id
                                ? "Starting..."
                                : "Start"}
                            </button>
                          )}

                          {session.status ===
                            "In progress" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(
                                  session.id,
                                  "Completed"
                                )
                              }
                              disabled={
                                updatingSessionId ===
                                session.id
                              }
                            >
                              {updatingSessionId ===
                              session.id
                                ? "Completing..."
                                : "Complete"}
                            </button>
                          )}

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              startEditing(
                                session
                              )
                            }
                            disabled={
                              deletingSessionId ===
                              session.id
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="danger-button"
                            onClick={() =>
                              handleDelete(
                                session
                              )
                            }
                            disabled={
                              deletingSessionId ===
                              session.id
                            }
                          >
                            {deletingSessionId ===
                            session.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                );
              }
            )}
          </div>
        </section>
      </main>
    </div>
  );
}