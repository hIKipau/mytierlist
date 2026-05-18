import { AUTH_ENDPOINTS } from "./constants";
import type { AuthPayload, AuthSubmitResult, ModalName } from "../../components/Modal/types";

const AUTH_LOGIN_KEY = "auth_login";

// ── Persisted login ───────────────────────────────────────────
// Храним только строку login — не токен, не чувствительные данные.
// Нужно исключительно для мгновенного восстановления UI без сетевого запроса.
// Безопасность обеспечивают httpOnly cookies, а не этот ключ.

export function getStoredLogin(): string | null {
  return localStorage.getItem(AUTH_LOGIN_KEY);
}

function saveLogin(login: string) {
  localStorage.setItem(AUTH_LOGIN_KEY, login);
}

function clearLogin() {
  localStorage.removeItem(AUTH_LOGIN_KEY);
}

// ── Session-expired callback ──────────────────────────────────

let onSessionExpiredCallback: (() => void) | null = null;

export function setOnSessionExpired(cb: () => void) {
  onSessionExpiredCallback = cb;
}

// ── Refresh ──────────────────────────────────────────────────
// Браузер сам прикладывает cookie refresh_token — никакого body не нужно.
// Сервер ставит новую пару cookies в ответе.

async function refreshTokens(): Promise<boolean> {
  try {
    const response = await fetch("/api/v1/auth/refresh", { method: "POST" });
    return response.ok;
  } catch {
    return false;
  }
}

// ── Authenticated fetch ───────────────────────────────────────
// Если получили 401 — пробует refresh один раз и повторяет.
// Если refresh тоже упал — сессия мертва: чистим login и уведомляем HomePage.

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status !== 401) return response;

  const refreshed = await refreshTokens();
  if (!refreshed) {
    clearLogin();
    onSessionExpiredCallback?.();
    return response;
  }

  return fetch(url, options);
}

// ── Logout ───────────────────────────────────────────────────

export async function logout(): Promise<void> {
  try {
    await fetch("/api/v1/auth/logout", { method: "POST" });
  } catch {
    // best-effort
  }
  clearLogin();
}

// ── Auth submit (login / register) ───────────────────────────

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data !== "object" || data === null) return fallback;
  const record = data as Record<string, unknown>;
  if (typeof record["error"]   === "string") return record["error"];
  if (typeof record["message"] === "string") return record["message"];
  return fallback;
}

export async function submitAuthRequest(name: ModalName, payload: AuthPayload): Promise<AuthSubmitResult> {
  const endpoint     = AUTH_ENDPOINTS[name];
  const defaultError = name === "login" ? "Ошибка входа." : "Ошибка регистрации.";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 429) {
      return { ok: false, message: "Слишком много запросов. Подождите минуту.", data: null };
    }

    if (response.status === 409) {
      return { ok: false, message: "Пользователь с таким логином уже существует.", data: null };
    }

    if (!response.ok) {
      let jsonData: unknown = null;
      try { jsonData = await response.json(); } catch { /* пустой body */ }
      return { ok: false, message: getErrorMessage(jsonData, defaultError), data: jsonData };
    }

    saveLogin(payload["login"] ?? "");

    return {
      ok: true,
      message: name === "login" ? "Вход выполнен." : "Регистрация выполнена.",
      data: null,
    };
  } catch (error) {
    console.error("[auth] request failed:", error);
    return {
      ok: false,
      message: "Сервер недоступен. Убедись, что auth-service запущен на localhost:8080.",
      data: null,
    };
  }
}
