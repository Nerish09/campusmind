const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to connect to CampusMind API");
  }

  return response.json();
}

export type Course = {
  code: string;
  name: string;
  instructor: string;
  progress: number;
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

export type Assignment = {
  course: string;
  title: string;
  due: string;
  priority: string;
  status: string;
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