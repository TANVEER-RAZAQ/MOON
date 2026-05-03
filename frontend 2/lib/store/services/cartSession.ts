const GUEST_CART_SESSION_KEY = 'moon_guest_cart_session_v1';

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `guest-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

export function getGuestCartSessionId(): string {
  if (typeof window === 'undefined') return '';

  const existing = localStorage.getItem(GUEST_CART_SESSION_KEY);
  if (existing) return existing;

  const sessionId = createSessionId();
  localStorage.setItem(GUEST_CART_SESSION_KEY, sessionId);
  return sessionId;
}
