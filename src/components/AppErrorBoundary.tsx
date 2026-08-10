import { Component, type ReactNode } from "react";
import { recordCrash } from "@/lib/crashReport";

/**
 * The screen a learner sees instead of nothing.
 *
 * Without a boundary, one render throw unmounts every React tree above it —
 * which for this app means the whole window goes blank mid-lesson and the
 * learner's only option is to guess that closing it might help. A crash the
 * app cannot survive should still be a crash it can DESCRIBE and offer a way
 * out of.
 *
 * The text is hard-written in both languages rather than routed through ui():
 * this component must depend on as little of the app as possible, because it
 * is what renders when some part of the app has just proven unreliable.
 */
type State = { failed: boolean };

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: { componentStack?: string | null }) {
    recordCrash({
      kind: "render",
      message: String((error as Error)?.message ?? error ?? "render error"),
      stack: (error as Error)?.stack ? String((error as Error).stack).slice(0, 4000) : undefined,
      componentStack: info?.componentStack ? String(info.componentStack).slice(0, 4000) : undefined,
    });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="app-crash-screen" role="alert">
        <div className="app-crash-card">
          <strong>Something went wrong — nothing is lost.</strong>
          <p>Etwas ist schiefgelaufen — nichts ist verloren.</p>
          <p className="app-crash-detail">
            Your progress is saved after every answer. The details were recorded, so this can be fixed.
            <br />
            Dein Fortschritt wird nach jeder Antwort gespeichert. Die Details wurden aufgezeichnet.
          </p>
          <div className="app-crash-actions">
            {/* Full reload rather than a state reset: whatever threw is still
                in memory, and handing the learner back the same broken state
                would just show this card again. */}
            <button type="button" onClick={() => window.location.reload()}>
              Keep going / Weiter lernen
            </button>
          </div>
        </div>
      </div>
    );
  }
}
