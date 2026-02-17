export type ModalName = "login" | "signup";

export type AuthPayload = Record<string, string>;

export type AuthSubmitResult = {
  ok: boolean;
  message: string;
  data: unknown;
};

export type FieldConfig = {
  label: string;
  type: "email" | "password" | "text";
  name: string;
  autoComplete: string;
};

export type ModalConfig = {
  title: string;
  submitLabel: string;
  switchTarget: ModalName;
  switchLabel: string;
  hintPrefix: string;
  fields: FieldConfig[];
};

export type ModalConfigMap = Record<ModalName, ModalConfig>;

export type ModalProps = {
  name: ModalName;
  config: ModalConfig;
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (name: ModalName) => void;
  onSubmit: (name: ModalName, payload: AuthPayload) => Promise<AuthSubmitResult>;
};
