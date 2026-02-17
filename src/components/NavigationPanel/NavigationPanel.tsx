import { NAV_ITEMS } from "./constants";
import type { NavigationPanelProps } from "./types";

function NavigationPanel({ nicknameQuery, searchStatus, onNicknameChange, onSearchSubmit }: NavigationPanelProps) {
  return (
    <aside className="panel panel-left">
      <h2 className="panel-title">Навигация</h2>

      <form className="search-form" onSubmit={onSearchSubmit}>
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
            onChange={(event) => onNicknameChange(event.target.value)}
          />
          <button className="search-btn" type="submit">
            Найти
          </button>
        </div>
      </form>

      {searchStatus ? <p className="search-status">{searchStatus}</p> : null}

      <ul className="nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

export default NavigationPanel;
