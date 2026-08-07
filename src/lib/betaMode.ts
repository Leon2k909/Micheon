const KEY = "gl-conversation-beta";

/**
 * Conversation Beta, per install. Off unless it has been switched on, and the
 * entry point that switches it on is only shown on Leon's account.
 */
export function conversationBetaOn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setConversationBeta(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // Nothing to do: the beta simply stays off.
  }
}
