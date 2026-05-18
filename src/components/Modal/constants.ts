import type { ModalConfigMap } from "./types";

export const MODAL_CONFIG: ModalConfigMap = {
  login: {
    title: "LOG IN",
    submitLabel: "LOG IN",
    switchTarget: "signup",
    switchLabel: "Sign up",
    hintPrefix: "No account?",
    fields: [
      { label: "Login", type: "text", name: "login", autoComplete: "username" },
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
      { label: "Login", type: "text", name: "login", autoComplete: "username" },
      { label: "Password", type: "password", name: "password", autoComplete: "new-password" },
    ],
  },
};
