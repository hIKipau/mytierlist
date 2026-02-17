import type { HeaderProps } from "./types";

function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="brand" aria-label="MYTIERLIST">
          MYTIERLIST
        </h1>

        <div className="auth" aria-label="auth">
          <button className="auth-link" type="button" onClick={onLoginClick}>
            LOG IN
          </button>
          <button className="auth-link" type="button" onClick={onSignupClick}>
            SIGN UP
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
