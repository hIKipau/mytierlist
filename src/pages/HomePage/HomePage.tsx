import { useCallback, useEffect, useRef, useState } from "react";
import CreateTierlistPanel from "../../components/CreateTierlistPanel/CreateTierlistPanel";
import FeedPanel from "../../components/FeedPanel/FeedPanel";
import { FEED_PREVIEW } from "../../components/FeedPanel/constants";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Modal from "../../components/Modal/Modal";
import { MODAL_CONFIG } from "../../components/Modal/constants";
import type { ModalConfig, ModalName } from "../../components/Modal/types";
import NavigationPanel from "../../components/NavigationPanel/NavigationPanel";
import { submitAuthRequest } from "./api";

function HomePage() {
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

  const handleNicknameSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const query = nicknameQuery.trim();
      if (!query) {
        setSearchStatus("Введите никнейм для поиска.");
        return;
      }

      // Заглушка под backend-поиск.
      setSearchStatus(`Ищем пользователя @${query}...`);
      console.info("[stub] nickname search:", query);
    },
    [nicknameQuery],
  );

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
        <Header onLoginClick={() => openModal("login")} onSignupClick={() => openModal("signup")} />

        <main className="main">
          <div className="main-grid">
            <NavigationPanel
              nicknameQuery={nicknameQuery}
              searchStatus={searchStatus}
              onNicknameChange={setNicknameQuery}
              onSearchSubmit={handleNicknameSearch}
            />
            <FeedPanel items={FEED_PREVIEW} />
            <CreateTierlistPanel />
          </div>
        </main>

        <Footer />
      </div>

      {(Object.entries(MODAL_CONFIG) as [ModalName, ModalConfig][]).map(([name, config]) => (
        <Modal
          key={name}
          name={name}
          config={config}
          isOpen={openModalName === name}
          onClose={closeModal}
          onSwitch={switchModal}
          onSubmit={submitAuthRequest}
        />
      ))}
    </>
  );
}

export default HomePage;
