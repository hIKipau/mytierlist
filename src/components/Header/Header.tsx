import type { HeaderProps } from "./types";

function Header({ authUser, onLoginClick, onSignupClick, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="brand" aria-label="mytierlist">
          MYTIERLIST
        </h1>

        <div className="auth" aria-label="auth">
          {authUser ? (
            <>
              <span className="auth-user">@{authUser}</span>
              <button className="auth-link" type="button" onClick={onLogout}>
                LOG OUT
              </button>
            </>
          ) : (
            <>
              <button className="auth-link" type="button" onClick={onLoginClick}>
                LOG IN
              </button>
              <button className="auth-link" type="button" onClick={onSignupClick}>
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
