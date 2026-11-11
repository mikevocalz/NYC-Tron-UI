export interface ToastMessage { readonly id: string; readonly title: string; readonly detail?: string; readonly tone: "info" | "success" | "error"; readonly action?: { readonly id: string; readonly label: string } }
export type JobAction = "cancel" | "pause" | "resume" | "retry";
interface JobBase { readonly id: string; readonly title: string; readonly detail?: string; readonly progress: number | null; readonly actions: readonly JobAction[] }
export type ProgressJob = JobBase & ({ readonly status: "queued" | "running" | "paused" | "cancelling" | "completed" | "cancelled"; readonly error?: never } | { readonly status: "failed"; readonly error: string });
const allowed: Record<ProgressJob["status"], readonly JobAction[]> = { queued: ["cancel"], running: ["pause", "cancel"], paused: ["resume", "cancel"], failed: ["retry"], cancelling: [], completed: [], cancelled: ["retry"] };
export const jobActionLabel: Record<JobAction, string> = { cancel: "Cancel", pause: "Pause", resume: "Resume", retry: "Retry" };
export function validateFeedback(toasts: readonly ToastMessage[], jobs: readonly ProgressJob[]): void {
  if (toasts.length > 100 || jobs.length > 1000) throw new RangeError("Page feedback beyond 100 notifications or 1000 jobs");
  for (const rows of [toasts, jobs]) {
    const ids = new Set<string>();
    for (const row of rows) { if (!row.id || ids.has(row.id) || !row.title.trim()) throw new TypeError("Feedback items need distinct IDs and titles"); ids.add(row.id); }
  }
  for (const toast of toasts) if (toast.action && (!toast.action.id || !toast.action.label.trim())) throw new TypeError("Toast actions need an ID and label");
  for (const job of jobs) {
    if (job.progress !== null && (!Number.isFinite(job.progress) || job.progress < 0 || job.progress > 1)) throw new RangeError("Job progress must be in 0...1 or unknown");
    if (new Set(job.actions).size !== job.actions.length || job.actions.some(action => !allowed[job.status].includes(action))) throw new TypeError("Job actions do not match the reported status");
    if (job.status === "failed" && !job.error.trim()) throw new TypeError("A failed job needs its actual error");
    if (job.status === "completed" && job.progress !== 1) throw new RangeError("A completed job must report full progress");
  }
}
