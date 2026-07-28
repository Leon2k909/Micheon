/**
 * Record a completed lesson without allowing storage/telemetry failure to
 * strand the learner on the dashboard. The next lesson is always queued.
 */
export function finishLessonAndQueueNext(
  recordCompletion: () => void,
  queueNext: () => void,
  reportError: (error: unknown) => void = (error) => console.warn("Could not save every lesson-completion stat", error)
) {
  try {
    recordCompletion();
  } catch (error) {
    try {
      reportError(error);
    } catch {
      // Reporting must never be able to cancel the next lesson either.
    }
  } finally {
    queueNext();
  }
}
