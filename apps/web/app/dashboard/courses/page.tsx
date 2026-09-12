"use client";

import {
  CSSProperties,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Course,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../../../lib/api";

import ConfirmModal from "../components/ConfirmModal";
import Sidebar from "../components/Sidebar";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [progress, setProgress] = useState(0);

  const [editingCourseId, setEditingCourseId] =
    useState<number | null>(null);

  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editInstructor, setEditInstructor] = useState("");
  const [editProgress, setEditProgress] = useState(0);

  const [loading, setLoading] = useState(false);

  const [updatingCourseId, setUpdatingCourseId] =
    useState<number | null>(null);

  const [deletingCourseId, setDeletingCourseId] =
    useState<number | null>(null);

  const [courseToDelete, setCourseToDelete] =
    useState<Course | null>(null);

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

  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !code.trim() ||
      !name.trim() ||
      !instructor.trim()
    ) {
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

  function startEditing(course: Course) {
    setEditingCourseId(course.id);

    setEditCode(course.code);
    setEditName(course.name);
    setEditInstructor(course.instructor);
    setEditProgress(course.progress);

    setError("");
  }

  function cancelEditing() {
    setEditingCourseId(null);
    setError("");
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
    courseId: number
  ) {
    event.preventDefault();

    if (
      !editCode.trim() ||
      !editName.trim() ||
      !editInstructor.trim()
    ) {
      setError("Please complete all course fields.");
      return;
    }

    if (editProgress < 0 || editProgress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    setUpdatingCourseId(courseId);
    setError("");

    try {
      await updateCourse(courseId, {
        code: editCode.trim(),
        name: editName.trim(),
        instructor: editInstructor.trim(),
        progress: editProgress,
      });

      setEditingCourseId(null);

      await loadCourses();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update course.");
      }
    } finally {
      setUpdatingCourseId(null);
    }
  }

  function requestDelete(course: Course) {
    setCourseToDelete(course);
    setError("");
  }

  function cancelDelete() {
    if (deletingCourseId !== null) {
      return;
    }

    setCourseToDelete(null);
  }

  async function confirmDelete() {
    if (!courseToDelete) {
      return;
    }

    setDeletingCourseId(courseToDelete.id);
    setError("");

    try {
      await deleteCourse(courseToDelete.id);

      setCourseToDelete(null);

      await loadCourses();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to delete course.");
      }
    } finally {
      setDeletingCourseId(null);
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
            onClick={() => {
              setShowForm((current) => !current);
              setError("");
            }}
          >
            {showForm ? "Cancel" : "Add course"}
          </button>
        </section>

        {showForm && (
          <section className="study-section">
            <form
              className="study-form"
              onSubmit={handleCreate}
            >
              <div className="study-form-field">
                <label htmlFor="course-code">
                  Course code
                </label>

                <input
                  id="course-code"
                  type="text"
                  placeholder="Example: CS 3501"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value)
                  }
                />
              </div>

              <div className="study-form-field">
                <label htmlFor="course-name">
                  Course name
                </label>

                <input
                  id="course-name"
                  type="text"
                  placeholder="Example: Software Testing"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                />
              </div>

              <div className="study-form-field">
                <label htmlFor="course-instructor">
                  Instructor
                </label>

                <input
                  id="course-instructor"
                  type="text"
                  placeholder="Example: Dr. Lee"
                  value={instructor}
                  onChange={(event) =>
                    setInstructor(event.target.value)
                  }
                />
              </div>

              <div className="study-form-field">
                <label htmlFor="course-progress">
                  Progress
                </label>

                <input
                  id="course-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) =>
                    setProgress(
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create course"}
              </button>
            </form>
          </section>
        )}

        {error && (
          <p className="study-error">
            {error}
          </p>
        )}

        <section className="courses-grid">
          {courses.map((course) => {
            const isEditing =
              editingCourseId === course.id;

            return (
              <article
                className="dashboard-card course-card"
                key={course.id}
              >
                {isEditing ? (
                  <form
                    onSubmit={(event) =>
                      handleUpdate(
                        event,
                        course.id
                      )
                    }
                    className="course-edit-form"
                  >
                    <div className="course-edit-field">
                      <label
                        htmlFor={`edit-code-${course.id}`}
                      >
                        Course code
                      </label>

                      <input
                        id={`edit-code-${course.id}`}
                        type="text"
                        value={editCode}
                        onChange={(event) =>
                          setEditCode(
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="course-edit-field">
                      <label
                        htmlFor={`edit-name-${course.id}`}
                      >
                        Course name
                      </label>

                      <input
                        id={`edit-name-${course.id}`}
                        type="text"
                        value={editName}
                        onChange={(event) =>
                          setEditName(
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="course-edit-field">
                      <label
                        htmlFor={`edit-instructor-${course.id}`}
                      >
                        Instructor
                      </label>

                      <input
                        id={`edit-instructor-${course.id}`}
                        type="text"
                        value={editInstructor}
                        onChange={(event) =>
                          setEditInstructor(
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="course-edit-field">
                      <div className="course-edit-progress-header">
                        <label
                          htmlFor={`edit-progress-${course.id}`}
                        >
                          Progress
                        </label>

                        <span>
                          {editProgress}%
                        </span>
                      </div>

                      <input
                        id={`edit-progress-${course.id}`}
                        className="course-progress-slider"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={editProgress}
                        style={
                          {
                            "--progress": `${editProgress}%`,
                          } as CSSProperties
                        }
                        onChange={(event) =>
                          setEditProgress(
                            Number(
                              event.target.value
                            )
                          )
                        }
                      />

                      <div className="course-edit-progress-scale">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="course-edit-actions">
                      <button
                        type="submit"
                        disabled={
                          updatingCourseId ===
                          course.id
                        }
                      >
                        {updatingCourseId ===
                        course.id
                          ? "Saving..."
                          : "Save changes"}
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={cancelEditing}
                        disabled={
                          updatingCourseId ===
                          course.id
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="card-label">
                      {course.code}
                    </p>

                    <h2>{course.name}</h2>

                    <p>{course.instructor}</p>

                    <div className="course-progress-row">
                      <span>Progress</span>
                      <span>
                        {course.progress}%
                      </span>
                    </div>

                    <div className="course-progress-track">
                      <div
                        className="course-progress-fill"
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />
                    </div>

                    <div className="course-card-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          startEditing(course)
                        }
                        disabled={
                          deletingCourseId ===
                          course.id
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          requestDelete(course)
                        }
                        disabled={
                          deletingCourseId ===
                          course.id
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </section>
      </main>

      <ConfirmModal
        open={courseToDelete !== null}
        title={
          courseToDelete
            ? `Delete ${courseToDelete.name}?`
            : "Delete course?"
        }
        message={
          courseToDelete
            ? `This will permanently delete ${courseToDelete.code} — ${courseToDelete.name}. Any assignments and study sessions connected to this course will also be deleted. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete course"
        loading={
          courseToDelete !== null &&
          deletingCourseId === courseToDelete.id
        }
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}