import { useEffect, useRef, useState } from "react";
import type { AuthPayload, ModalConfig, ModalProps } from "./types";

function getInitialFormValues(config: ModalConfig): AuthPayload {
  return config.fields.reduce<AuthPayload>((accumulator, field) => {
    accumulator[field.name] = "";
    return accumulator;
  }, {});
}

function Modal({ name, config, isOpen, onClose, onSwitch, onSubmit }: ModalProps) {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const [values, setValues] = useState<AuthPayload>(() => getInitialFormValues(config));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
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

export default Modal;
