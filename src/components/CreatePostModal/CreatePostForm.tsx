import { useCallback, useEffect, useRef, useState } from "react";
import type { CreatePostModalProps, CreatePostValues } from "./types";

const EMPTY: CreatePostValues = { title: "", body: "" };

function CreatePostForm({ isOpen, author, onClose, onSubmit }: CreatePostModalProps) {
  const titleRef     = useRef<HTMLInputElement | null>(null);
  const bodyRef      = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [values, setValues]           = useState<CreatePostValues>(EMPTY);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging]   = useState(false);

  const canPublish = values.title.trim().length > 0 && values.body.trim().length > 0;

  useEffect(() => {
    if (!isOpen) return;
    setValues(EMPTY);
    setAttachments([]);
    setIsDragging(false);
    if (bodyRef.current) bodyRef.current.style.height = "auto";
    window.setTimeout(() => titleRef.current?.focus(), 0);
  }, [isOpen]);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [values.body]);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    setAttachments(prev => [...prev, ...Array.from(files)]);
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPublish) return;
    onSubmit({ title: values.title.trim(), body: values.body.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="post-form-card">
      <div className="post-modal-head">
        <span className="post-modal-author">@{author}</span>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть">×</button>
      </div>

      <form className="post-modal-form" onSubmit={handleSubmit}>
        <input
          ref={titleRef}
          className="post-title-input"
          type="text"
          placeholder="Название"
          maxLength={120}
          value={values.title}
          onChange={e => setValues(v => ({ ...v, title: e.target.value }))}
        />

        <div
          className={`attach-zone ${isDragging ? "attach-zone--active" : ""} ${attachments.length > 0 ? "attach-zone--filled" : ""}`}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
          onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Добавить вложение"
          onKeyDown={e => e.key === "Enter" && fileInputRef.current?.click()}
        >
          {attachments.length === 0 ? (
            <>
              <span className="attach-plus">+</span>
              <span className="attach-label">Добавить вложение</span>
              <span className="attach-hint">или перетащите файл сюда</span>
            </>
          ) : (
            <ul className="attach-list" onClick={e => e.stopPropagation()}>
              {attachments.map((file, i) => (
                <li key={i} className="attach-item">
                  <span className="attach-name">{file.name}</span>
                  <button
                    className="attach-remove"
                    type="button"
                    aria-label={`Удалить ${file.name}`}
                    onClick={() => removeAttachment(i)}
                  >×</button>
                </li>
              ))}
              <li className="attach-more" onClick={() => fileInputRef.current?.click()}>
                + ещё файл
              </li>
            </ul>
          )}
          <input ref={fileInputRef} type="file" multiple hidden onChange={e => addFiles(e.target.files)} />
        </div>

        <textarea
          ref={bodyRef}
          className="post-body-input"
          placeholder="Текст поста..."
          maxLength={2000}
          value={values.body}
          onChange={e => setValues(v => ({ ...v, body: e.target.value }))}
        />

        <button
          className={`post-publish-btn ${canPublish ? "post-publish-btn--active" : ""}`}
          type="submit"
          disabled={!canPublish}
        >
          ОПУБЛИКОВАТЬ
        </button>
      </form>
    </div>
  );
}

export default CreatePostForm;
