"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Assignment,
  Course,
  createAssignment,
  deleteAssignment,
  getAssignments,
  getCourses,
  updateAssignment,
} from "../../../lib/api";

import ConfirmModal from "../components/ConfirmModal";
import Sidebar from "../components/Sidebar";

const priorities = [
  "Low priority",
  "Medium priority",
  "High priority",
];

const statuses = [
  "Not started",
  "In progress",
  "Complete",
];

export default function AssignmentsPage() {
  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [courseId, setCourseId] =
    useState<number>(0);

  const [title, setTitle] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [priority, setPriority] =
    useState("Medium priority");

  const [status, setStatus] =
    useState("Not started");

  const [
    editingAssignmentId,
    setEditingAssignmentId,
  ] = useState<number | null>(null);

  const [editCourseId, setEditCourseId] =
    useState<number>(0);

  const [editTitle, setEditTitle] =
    useState("");

  const [editDueDate, setEditDueDate] =
    useState("");

  const [editPriority, setEditPriority] =
    useState("Medium priority");

  const [editStatus, setEditStatus] =
    useState("Not started");

  const [loading, setLoading] =
    useState(false);

  const [
    updatingAssignmentId,
    setUpdatingAssignmentId,
  ] = useState<number | null>(null);

  const [
    deletingAssignmentId,
    setDeletingAssignmentId,
  ] = useState<number | null>(null);

  const [
    assignmentToDelete,
    setAssignmentToDelete,
  ] = useState<Assignment | null>(null);

  const [error, setError] =
    useState("");

  async function loadAssignments() {
    try {
      const data =
        await getAssignments();

      setAssignments(data);
    } catch {
      setError(
        "Failed to load assignments."
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
    loadAssignments();
    loadCourses();
  }, []);

  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      courseId === 0 ||
      !title.trim() ||
      !dueDate.trim()
    ) {
      setError(
        "Please complete all assignment fields."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createAssignment({
        course_id: courseId,
        title: title.trim(),
        due_date: dueDate.trim(),
        priority,
        status,
      });

      setTitle("");
      setDueDate("");
      setPriority("Medium priority");
      setStatus("Not started");
      setShowForm(false);

      await loadAssignments();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Failed to create assignment."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function startEditing(
    assignment: Assignment
  ) {
    setEditingAssignmentId(
      assignment.id
    );

    setEditCourseId(
      assignment.course_id
    );

    setEditTitle(
      assignment.title
    );

    setEditDueDate(
      assignment.due
    );

    setEditPriority(
      assignment.priority
    );

    setEditStatus(
      assignment.status
    );

    setError("");
  }

  function cancelEditing() {
    setEditingAssignmentId(null);
    setError("");
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
    assignmentId: number
  ) {
    event.preventDefault();

    if (
      editCourseId === 0 ||
      !editTitle.trim() ||
      !editDueDate.trim()
    ) {
      setError(
        "Please complete all assignment fields."
      );
      return;
    }

    setUpdatingAssignmentId(
      assignmentId
    );

    setError("");

    try {
      await updateAssignment(
        assignmentId,
        {
          course_id: editCourseId,
          title: editTitle.trim(),
          due_date: editDueDate.trim(),
          priority: editPriority,
          status: editStatus,
        }
      );

      setEditingAssignmentId(
        null
      );

      await loadAssignments();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Failed to update assignment."
        );
      }
    } finally {
      setUpdatingAssignmentId(
        null
      );
    }
  }

  function requestDelete(
    assignment: Assignment
  ) {
    setAssignmentToDelete(
      assignment
    );

    setError("");
  }

  function cancelDelete() {
    if (
      deletingAssignmentId !== null
    ) {
      return;
    }

    setAssignmentToDelete(null);
  }

  async function confirmDelete() {
    if (!assignmentToDelete) {
      return;
    }

    setDeletingAssignmentId(
      assignmentToDelete.id
    );

    setError("");

    try {
      await deleteAssignment(
        assignmentToDelete.id
      );

      setAssignmentToDelete(
        null
      );

      await loadAssignments();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Failed to delete assignment."
        );
      }
    } finally {
      setDeletingAssignmentId(
        null
      );
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">
              ASSIGNMENTS
            </p>

            <h1>Your workload</h1>

            <p className="dashboard-subtitle">
              Track deadlines, priority,
              and assignment progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(
                (current) => !current
              );

              setError("");
            }}
          >
            {showForm
              ? "Cancel"
              : "Add assignment"}
          </button>
        </section>

        {showForm && (
          <section className="study-section">
            <form
              className="assignment-form"
              onSubmit={
                handleCreate
              }
            >
              <div className="assignment-form-field">
                <label
                  htmlFor="assignment-course"
                >
                  Course
                </label>

                <select
                  id="assignment-course"
                  value={courseId}
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

              <div className="assignment-form-field">
                <label
                  htmlFor="assignment-title"
                >
                  Assignment
                </label>

                <input
                  id="assignment-title"
                  type="text"
                  placeholder="Example: Database Project"
                  value={title}
                  onChange={(
                    event
                  ) =>
                    setTitle(
                      event
                        .target
                        .value
                    )
                  }
                />
              </div>

              <div className="assignment-form-field">
                <label
                  htmlFor="assignment-due"
                >
                  Due
                </label>

                <input
                  id="assignment-due"
                  type="text"
                  placeholder="Example: Friday"
                  value={dueDate}
                  onChange={(
                    event
                  ) =>
                    setDueDate(
                      event
                        .target
                        .value
                    )
                  }
                />
              </div>

              <div className="assignment-form-field">
                <label
                  htmlFor="assignment-priority"
                >
                  Priority
                </label>

                <select
                  id="assignment-priority"
                  value={priority}
                  onChange={(
                    event
                  ) =>
                    setPriority(
                      event
                        .target
                        .value
                    )
                  }
                >
                  {priorities.map(
                    (item) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="assignment-form-field">
                <label
                  htmlFor="assignment-status"
                >
                  Status
                </label>

                <select
                  id="assignment-status"
                  value={status}
                  onChange={(
                    event
                  ) =>
                    setStatus(
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
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create assignment"}
              </button>
            </form>
          </section>
        )}

        {error && (
          <p className="study-error">
            {error}
          </p>
        )}

        <section className="assignment-list">
          {assignments.map(
            (assignment) => {
              const isEditing =
                editingAssignmentId ===
                assignment.id;

              return (
                <article
                  className="assignment-card"
                  key={
                    assignment.id
                  }
                >
                  {isEditing ? (
                    <form
                      className="assignment-edit-form"
                      onSubmit={(
                        event
                      ) =>
                        handleUpdate(
                          event,
                          assignment.id
                        )
                      }
                    >
                      <div className="assignment-form-field">
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

                      <div className="assignment-form-field">
                        <label>
                          Assignment
                        </label>

                        <input
                          type="text"
                          value={
                            editTitle
                          }
                          onChange={(
                            event
                          ) =>
                            setEditTitle(
                              event
                                .target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="assignment-form-field">
                        <label>
                          Due
                        </label>

                        <input
                          type="text"
                          value={
                            editDueDate
                          }
                          onChange={(
                            event
                          ) =>
                            setEditDueDate(
                              event
                                .target
                                .value
                            )
                          }
                        />
                      </div>

                      <div className="assignment-form-field">
                        <label>
                          Priority
                        </label>

                        <select
                          value={
                            editPriority
                          }
                          onChange={(
                            event
                          ) =>
                            setEditPriority(
                              event
                                .target
                                .value
                            )
                          }
                        >
                          {priorities.map(
                            (item) => (
                              <option
                                key={
                                  item
                                }
                                value={
                                  item
                                }
                              >
                                {item}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="assignment-form-field">
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
                                {item}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="assignment-edit-actions">
                        <button
                          type="submit"
                          disabled={
                            updatingAssignmentId ===
                            assignment.id
                          }
                        >
                          {updatingAssignmentId ===
                          assignment.id
                            ? "Saving..."
                            : "Save changes"}
                        </button>

                        <button
                          type="button"
                          className="secondary-button"
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
                            assignment.course
                          }
                        </p>

                        <h2>
                          {
                            assignment.title
                          }
                        </h2>

                        <p className="assignment-due">
                          Due{" "}
                          {
                            assignment.due
                          }
                        </p>
                      </div>

                      <div className="assignment-card-meta">
                        <span
                          className={`assignment-priority assignment-priority-${assignment.priority
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )}`}
                        >
                          {
                            assignment.priority
                          }
                        </span>

                        <span className="assignment-status">
                          {
                            assignment.status
                          }
                        </span>

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            startEditing(
                              assignment
                            )
                          }
                          disabled={
                            deletingAssignmentId ===
                            assignment.id
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          onClick={() =>
                            requestDelete(
                              assignment
                            )
                          }
                          disabled={
                            deletingAssignmentId ===
                            assignment.id
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            }
          )}
        </section>
      </main>

      <ConfirmModal
        open={
          assignmentToDelete !==
          null
        }
        title={
          assignmentToDelete
            ? `Delete ${assignmentToDelete.title}?`
            : "Delete assignment?"
        }
        message={
          assignmentToDelete
            ? `This will permanently delete "${assignmentToDelete.title}" from ${assignmentToDelete.course}. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete assignment"
        loading={
          assignmentToDelete !==
            null &&
          deletingAssignmentId ===
            assignmentToDelete.id
        }
        onCancel={cancelDelete}
        onConfirm={
          confirmDelete
        }
      />
    </div>
  );
}