import type { FormEventHandler } from "react";

export type NavigationPanelProps = {
  nicknameQuery: string;
  searchStatus: string;
  onNicknameChange: (value: string) => void;
  onSearchSubmit: FormEventHandler<HTMLFormElement>;
};
