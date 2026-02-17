import type { ModalConfigMap } from "./types";

export const MODAL_CONFIG: ModalConfigMap = {
  login: {
    title: "LOG IN",
    submitLabel: "LOG IN",
    switchTarget: "signup",
    switchLabel: "Sign up",
    hintPrefix: "No account?",
    fields: [
      { label: "Email", type: "email", name: "email", autoComplete: "email" },
      { label: "Password", type: "password", name: "password", autoComplete: "current-password" },
    ],
  },
  signup: {
    title: "SIGN UP",
    submitLabel: "SIGN UP",
    switchTarget: "login",
    switchLabel: "Log in",
    hintPrefix: "Already have an account?",
    fields: [
      { label: "Username", type: "text", name: "username", autoComplete: "username" },
      { label: "Email", type: "email", name: "email", autoComplete: "email" },
      { label: "Password", type: "password", name: "password", autoComplete: "new-password" },
    ],
  },
};
