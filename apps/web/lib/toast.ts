export type ToastType = "success" | "error" | "info";

export function showToast(
  message: string,
  type: ToastType = "success"
) {
  if (typeof document === "undefined") {
    return;
  }

  const toast = document.createElement("div");

  toast.className = `campusmind-toast campusmind-toast-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("campusmind-toast-visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("campusmind-toast-visible");

    window.setTimeout(() => {
      toast.remove();
    }, 250);
  }, 2600);
}