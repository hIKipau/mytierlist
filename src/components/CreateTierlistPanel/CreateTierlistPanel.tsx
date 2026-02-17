import type { CreateTierlistPanelProps } from "./types";

function CreateTierlistPanel({ onCreateFromScratch, onUseTemplate, onImportJson }: CreateTierlistPanelProps) {
  return (
    <aside className="panel panel-right">
      <h2 className="panel-title">Создать тирлист</h2>
      <p className="panel-copy">Выбери сценарий создания и опубликуй в ленту.</p>

      <div className="create-actions">
        <button className="create-btn create-btn-primary" type="button" onClick={onCreateFromScratch}>
          Создать с нуля
        </button>
        <button className="create-btn create-btn-secondary" type="button" onClick={onUseTemplate}>
          Использовать шаблон
        </button>
        <button className="create-btn create-btn-ghost" type="button" onClick={onImportJson}>
          Импортировать JSON
        </button>
      </div>
    </aside>
  );
}

export default CreateTierlistPanel;
