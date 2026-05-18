import { useState } from "react";
import CreatePostModal from "../CreatePostModal/CreatePostModal";
import type { FeedItem, FeedPanelProps } from "./types";

function FeedPanel({ items, authUser, onNewPost }: FeedPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (values: { title: string; body: string }) => {
    const post: FeedItem = {
      id: crypto.randomUUID(),
      type: "post",
      title: values.title,
      summary: values.body,
      author: `@${authUser ?? "unknown"}`,
    };
    onNewPost(post);
    setIsFormOpen(false);
  };

  return (
    <section className="panel panel-feed">
      <header className="feed-head">
        <h2 className="panel-title">Лента</h2>
        <span className="feed-state">Посты + тирлисты + медиа</span>
      </header>

      {authUser && (
        <button className="compose-trigger" type="button" onClick={() => setIsFormOpen(true)}>
          Создать пост +
        </button>
      )}

      <CreatePostModal
        isOpen={isFormOpen}
        author={authUser ?? ""}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

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
