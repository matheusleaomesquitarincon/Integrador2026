import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { createNote } from "../services/studyNoteService";

const TOPIC_OPTIONS = [
  { value: "arrays", label: "Arrays" },
  { value: "vetores", label: "Vetores" },
  { value: "matrizes", label: "Matrizes" },
  { value: "tabelas-hash", label: "Tabela Hash" },
  { value: "poo", label: "POO" },
  { value: "springboot", label: "Spring Boot" },
  { value: "portugol", label: "Portugol" },
  { value: "outros", label: "Outros" },
];

const QuickNoteOrb = ({ defaultTopic = "outros" }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setTopic(defaultTopic);
  }, [defaultTopic]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !text.trim()) {
      setStatus({ type: "error", msg: "Preencha título e conteúdo." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await createNote({ title: title.trim(), text: text.trim(), topic });
      setStatus({ type: "success", msg: "Anotação salva!" });
      setTitle("");
      setText("");
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      console.error(err);
      if (err && err.status === 401) {
        setStatus({ type: "error", msg: "Sessão expirou. Faça login novamente." });
      } else {
        setStatus({ type: "error", msg: "Não foi possível salvar agora." });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <>
      <button
        type="button"
        className={`quick-note-orb ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar bloco de notas rápido" : "Abrir bloco de notas rápido"}
        title={open ? "Fechar" : "Anotar rapidamente"}
      >
        <Icon name={open ? "close" : "notebook"} size={22} />
      </button>

      {open && (
        <div
          className="quick-note-panel"
          role="dialog"
          aria-label="Nova anotação rápida"
        >
          <header className="quick-note-header">
            <div>
              <strong>Anotação rápida</strong>
              <p>Salva no seu bloco de notas.</p>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              title="Fechar"
            >
              <Icon name="close" size={14} />
            </button>
          </header>

          <form onSubmit={handleSave} onKeyDown={handleKeyDown}>
            <div className="label">Tópico</div>
            <select
              className="select"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {TOPIC_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="label">Título</div>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Diferença Array x ArrayList"
              maxLength={120}
            />

            <div className="label">Conteúdo</div>
            <textarea
              className="textarea quick-note-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"# Título\n\n- Ponto importante\n\n```java\nint x = 10;\n```"}
            />

            {status && (
              <div className={`quick-note-status ${status.type}`} role="status">
                {status.msg}
              </div>
            )}

            <div className="editor-actions quick-note-actions">
              <button type="submit" className="button-primary" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <Link to="/estudo" className="button-secondary">
                Ver todas
              </Link>
            </div>
            <div className="markdown-hint">
              Markdown suportado. <code>Ctrl+Enter</code> salva.
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default QuickNoteOrb;
