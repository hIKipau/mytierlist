import type { FeedPanelProps } from "./types";

function FeedPanel({ items }: FeedPanelProps) {
  return (
    <section className="panel panel-feed">
      <header className="feed-head">
        <h2 className="panel-title">Лента</h2>
        <span className="feed-state">Посты + тирлисты + медиа</span>
      </header>

      <ul className="feed-list">
        {items.map((item) => (
          <li className="feed-item" key={item.id}>
            <span className={`feed-tag feed-tag-${item.type}`}>{item.type}</span>
            <h3 className="feed-title">{item.title}</h3>
            <p className="feed-summary">{item.summary}</p>
            <span className="feed-author">{item.author}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FeedPanel;
