import { showToast } from "./toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// --------------------
// Health
// --------------------

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to connect to CampusMind API");
  }

  return response.json();
}

// --------------------
// Courses
// --------------------

export type Course = {
  id: number;
  code: string;
  name: string;
  instructor: string;
  progress: number;
};

export type CreateCourse = {
  code: string;
  name: string;
  instructor: string;
  progress: number;
};

export type UpdateCourse = {
  code?: string;
  name?: string;
  instructor?: string;
  progress?: number;
};

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/courses`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
}

export async function createCourse(
  data: CreateCourse
): Promise<Course> {
  const response = await fetch(`${API_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to create course",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to create course"
    );
  }

  const result = await response.json();

  showToast("Course created");

  return result;
}

export async function updateCourse(
  courseId: number,
  data: UpdateCourse
): Promise<Course> {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to update course",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to update course"
    );
  }

  const result = await response.json();

  showToast("Course updated");

  return result;
}

export async function deleteCourse(
  courseId: number
): Promise<void> {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to delete course",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to delete course"
    );
  }

  showToast("Course deleted");
}

// --------------------
// Assignments
// --------------------

export type Assignment = {
  id: number;
  course_id: number;
  course: string;
  title: string;
  due: string;
  priority: string;
  status: string;
};

export type CreateAssignment = {
  course_id: number;
  title: string;
  due_date: string;
  priority: string;
  status: string;
};

export type UpdateAssignment = {
  course_id?: number;
  title?: string;
  due_date?: string;
  priority?: string;
  status?: string;
};

export async function getAssignments(): Promise<Assignment[]> {
  const response = await fetch(`${API_URL}/assignments`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch assignments");
  }

  return response.json();
}

export async function createAssignment(
  data: CreateAssignment
): Promise<Assignment> {
  const response = await fetch(`${API_URL}/assignments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to create assignment",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to create assignment"
    );
  }

  const result = await response.json();

  showToast("Assignment created");

  return result;
}

export async function updateAssignment(
  assignmentId: number,
  data: UpdateAssignment
): Promise<Assignment> {
  const response = await fetch(
    `${API_URL}/assignments/${assignmentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to update assignment",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to update assignment"
    );
  }

  const result = await response.json();

  showToast("Assignment updated");

  return result;
}

export async function deleteAssignment(
  assignmentId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/assignments/${assignmentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to delete assignment",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to delete assignment"
    );
  }

  showToast("Assignment deleted");
}

// --------------------
// Study Sessions
// --------------------

export type StudySession = {
  id: number;
  course_id: number;
  subject: string;
  topic: string;
  duration: string;
  duration_minutes: number;
  status: string;
};

export type CreateStudySession = {
  course_id: number;
  topic: string;
  duration_minutes: number;
  status?: string;
};

export type UpdateStudySession = {
  course_id?: number;
  topic?: string;
  duration_minutes?: number;
  status?: string;
};

export async function getStudySessions(): Promise<StudySession[]> {
  const response = await fetch(`${API_URL}/study-sessions`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch study sessions");
  }

  return response.json();
}

export async function createStudySession(
  data: CreateStudySession
): Promise<StudySession> {
  const response = await fetch(`${API_URL}/study-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to create study session",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to create study session"
    );
  }

  const result = await response.json();

  showToast("Study session created");

  return result;
}

export async function updateStudySession(
  sessionId: number,
  data: UpdateStudySession
): Promise<StudySession> {
  const response = await fetch(
    `${API_URL}/study-sessions/${sessionId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to update study session",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to update study session"
    );
  }

  const result = await response.json();

  showToast("Study session updated");

  return result;
}

export async function updateStudySessionStatus(
  sessionId: number,
  status: string
): Promise<StudySession> {
  return updateStudySession(sessionId, {
    status,
  });
}

export async function deleteStudySession(
  sessionId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/study-sessions/${sessionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    showToast(
      errorData?.detail || "Failed to delete study session",
      "error"
    );

    throw new Error(
      errorData?.detail || "Failed to delete study session"
    );
  }

  showToast("Study session deleted");
}

// --------------------
// AI Assistant
// --------------------

export type AssistantResponse = {
  message: string;
  reply: string;
};

export async function askAssistant(
  message: string
): Promise<AssistantResponse> {
  const response = await fetch(`${API_URL}/assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    showToast(
      "Failed to get assistant response",
      "error"
    );

    throw new Error("Failed to get assistant response");
  }

  return response.json();
}