import { AUTH_ENDPOINTS } from "./constants";
import type { AuthPayload, AuthSubmitResult, ModalName } from "../../components/Modal/types";

function getMessageFromJson(data: unknown, fallback: string): string {
  if (typeof data !== "object" || data === null) return fallback;
  if (!("message" in data)) return fallback;

  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : fallback;
}

export async function submitAuthRequest(name: ModalName, payload: AuthPayload): Promise<AuthSubmitResult> {
  const endpoint = AUTH_ENDPOINTS[name];
  const defaultSuccess = name === "login" ? "Вход выполнен." : "Регистрация выполнена.";
  const defaultError = name === "login" ? "Ошибка входа." : "Ошибка регистрации.";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    let jsonData: unknown = null;
    try {
      jsonData = await response.json();
    } catch {
      jsonData = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        message: getMessageFromJson(jsonData, defaultError),
        data: jsonData,
      };
    }

    return {
      ok: true,
      message: getMessageFromJson(jsonData, defaultSuccess),
      data: jsonData,
    };
  } catch (error) {
    console.error("[stub] auth request failed:", error);
    return {
      ok: false,
      message: "Сервер недоступен. Проверь AUTH_ENDPOINTS и backend URL.",
      data: null,
    };
  }
}
