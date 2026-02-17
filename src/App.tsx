import { useCallback, useEffect, useRef, useState } from "react";

type ModalName = "login" | "signup";

type AuthPayload = Record<string, string>;

type AuthSubmitResult = {
  ok: boolean;
  message: string;
  data: unknown;
};

type FieldConfig = {
  label: string;
  type: "email" | "password" | "text";
  name: string;
  autoComplete: string;
};

type ModalConfig = {
  title: string;
  submitLabel: string;
  switchTarget: ModalName;
  switchLabel: string;
  hintPrefix: string;
  fields: FieldConfig[];
};

type FeedItemType = "post" | "tierlist" | "media";

type FeedItem = {
  id: string;
  type: FeedItemType;
  title: string;
  author: string;
  summary: string;
};

const AUTH_ENDPOINTS: Record<ModalName, string> = {
  // Заглушки: подставь реальные endpoint-ы твоего backend-а.
  login: "/api/auth/login",
  signup: "/api/auth/signup",
};

const MODAL_CONFIG: Record<ModalName, ModalConfig> = {
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

const FEED_PREVIEW: FeedItem[] = [
  {
    id: "f-1",
    type: "post",
    title: "Обсуждение новых шаблонов для аниме-тирлистов",
    author: "@sampleUser",
    summary: "Плейсхолдер поста: текстовые публикации пользователей будут показываться в общем потоке.",
  },
  {
    id: "f-2",
    type: "tierlist",
    title: "Тирлист лучших кооперативных игр",
    author: "@tiermaker",
    summary: "Плейсхолдер тирлиста: карточки готовых тирлистов выводятся вместе с постами.",
  },
  {
    id: "f-3",
    type: "media",
    title: "Медиа-подборка: кадры и обложки",
    author: "@mediaDrop",
    summary: "Плейсхолдер медиа: изображения, видео и другие медиа-посты отображаются в ленте.",
  },
];

type ModalProps = {
  name: ModalName;
  config: ModalConfig;
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (name: ModalName) => void;
  onSubmit: (name: ModalName, payload: AuthPayload) => Promise<AuthSubmitResult>;
};

function getInitialFormValues(config: ModalConfig): AuthPayload {
  return config.fields.reduce<AuthPayload>((accumulator, field) => {
    accumulator[field.name] = "";
    return accumulator;
  }, {});
}

function getMessageFromJson(data: unknown, fallback: string): string {
  if (typeof data !== "object" || data === null) return fallback;
  if (!("message" in data)) return fallback;
  const maybeMessage = (data as { message?: unknown }).message;
  return typeof maybeMessage === "string" ? maybeMessage : fallback;
}

function Modal({ name, config, isOpen, onClose, onSwitch, onSubmit }: ModalProps) {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<AuthPayload>(() => getInitialFormValues(config));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const dialogId = `${name}-title`;

  useEffect(() => {
    setValues(getInitialFormValues(config));
    setStatusText("");
    setErrorText("");
    setIsSubmitting(false);
  }, [config, isOpen]);

  useEffect(() => {
    if (!isOpen || !firstInputRef.current) return;
    window.setTimeout(() => firstInputRef.current?.focus(), 0);
  }, [isOpen]);

  const handleChange = (fieldName: string, value: string) => {
    setValues((previousValues) => ({
      ...previousValues,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusText("");
    setErrorText("");
    setIsSubmitting(true);

    const result = await onSubmit(name, values);
    if (result.ok) {
      setStatusText(result.message);
      onClose();
    } else {
      setErrorText(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <section className={isOpen ? "modal is-open" : "modal"} data-modal={name} aria-hidden={!isOpen}>
      <div className="modal-backdrop" onClick={onClose}></div>

      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby={dialogId}>
        <div className="modal-head">
          <h2 id={dialogId} className="modal-title">
            {config.title}
          </h2>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>

        <form className="modal-form" action="#" method="post" onSubmit={handleSubmit}>
          {config.fields.map((field, index) => (
            <label className="field" key={field.name}>
              <span className="field-label">{field.label}</span>
              <input
                ref={index === 0 ? firstInputRef : null}
                className="field-input"
                type={field.type}
                name={field.name}
                autoComplete={field.autoComplete}
                required
                value={values[field.name] ?? ""}
                onChange={(event) => handleChange(field.name, event.target.value)}
              />
            </label>
          ))}

          {errorText ? <p className="form-error">{errorText}</p> : null}
          {statusText ? <p className="form-success">{statusText}</p> : null}

          <button className="modal-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "SENDING..." : config.submitLabel}
          </button>

          <p className="modal-hint">
            {config.hintPrefix}{" "}
            <button className="btn-link modal-link" type="button" onClick={() => onSwitch(config.switchTarget)}>
              {config.switchLabel}
            </button>
          </p>
        </form>
      </div>
    </section>
  );
}

function App() {
  const [openModalName, setOpenModalName] = useState<ModalName | null>(null);
  const [nicknameQuery, setNicknameQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback(
    (name: ModalName) => {
      if (!openModalName && document.activeElement instanceof HTMLElement) {
        lastFocusedRef.current = document.activeElement;
      }
      setOpenModalName(name);
    },
    [openModalName],
  );

  const closeModal = useCallback(() => {
    setOpenModalName(null);
    const lastFocused = lastFocusedRef.current;
    if (lastFocused && typeof lastFocused.focus === "function") {
      window.setTimeout(() => lastFocused.focus(), 0);
    }
    lastFocusedRef.current = null;
  }, []);

  const switchModal = useCallback((name: ModalName) => {
    setOpenModalName(name);
  }, []);

  const submitAuth = useCallback(async (name: ModalName, payload: AuthPayload): Promise<AuthSubmitResult> => {
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
  }, []);

  const handleNicknameSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = nicknameQuery.trim();
    if (!query) {
      setSearchStatus("Введите никнейм для поиска.");
      return;
    }

    // Заглушка под backend-поиск.
    setSearchStatus(`Ищем пользователя @${query}...`);
    console.info("[stub] nickname search:", query);
  };

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(openModalName));
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [openModalName]);

  useEffect(() => {
    if (!openModalName) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeModal, openModalName]);

  return (
    <>
      <div className="app">
        <header className="header">
          <div className="header-inner">
            <h1 className="brand" aria-label="MYTIERLIST">
              MYTIERLIST
            </h1>

            <div className="auth" aria-label="auth">
              <button className="auth-link" type="button" onClick={() => openModal("login")}>
                LOG IN
              </button>
              <button className="auth-link" type="button" onClick={() => openModal("signup")}>
                SIGN UP
              </button>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="main-grid">
            <aside className="panel panel-left">
              <h2 className="panel-title">Навигация</h2>
              <form className="search-form" onSubmit={handleNicknameSearch}>
                <label className="search-label" htmlFor="nickname-search">
                  Поиск человека по никнейму
                </label>
                <div className="search-row">
                  <input
                    id="nickname-search"
                    className="search-input"
                    name="nickname"
                    type="text"
                    autoComplete="off"
                    placeholder="@nickname"
                    value={nicknameQuery}
                    onChange={(event) => setNicknameQuery(event.target.value)}
                  />
                  <button className="search-btn" type="submit">
                    Найти
                  </button>
                </div>
              </form>

              {searchStatus ? <p className="search-status">{searchStatus}</p> : null}

              <ul className="nav-list">
                <li>Главная лента</li>
                <li>Новые тирлисты</li>
                <li>Медиа-публикации</li>
                <li>Профили авторов</li>
              </ul>
            </aside>

            <section className="panel panel-feed">
              <header className="feed-head">
                <h2 className="panel-title">Лента</h2>
                <span className="feed-state">Посты + тирлисты + медиа</span>
              </header>

              <ul className="feed-list">
                {FEED_PREVIEW.map((item) => (
                  <li className="feed-item" key={item.id}>
                    <span className={`feed-tag feed-tag-${item.type}`}>{item.type}</span>
                    <h3 className="feed-title">{item.title}</h3>
                    <p className="feed-summary">{item.summary}</p>
                    <span className="feed-author">{item.author}</span>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="panel panel-right">
              <h2 className="panel-title">Создать тирлист</h2>
              <p className="panel-copy">Выбери сценарий создания и опубликуй в ленту.</p>

              <div className="create-actions">
                <button className="create-btn create-btn-primary" type="button">
                  Создать с нуля
                </button>
                <button className="create-btn create-btn-secondary" type="button">
                  Использовать шаблон
                </button>
                <button className="create-btn create-btn-ghost" type="button">
                  Импортировать JSON
                </button>
              </div>
            </aside>
          </div>
        </main>

        <footer className="footer">
          <div className="footer-inner">
            <span>mytierlist.com</span>
            <span>all rights are reserved</span>
            <span>by hIKipau</span>
          </div>
        </footer>
      </div>

      {(Object.entries(MODAL_CONFIG) as [ModalName, ModalConfig][]).map(([name, config]) => (
        <Modal
          key={name}
          name={name}
          config={config}
          isOpen={openModalName === name}
          onClose={closeModal}
          onSwitch={switchModal}
          onSubmit={submitAuth}
        />
      ))}
    </>
  );
}

export default App;
