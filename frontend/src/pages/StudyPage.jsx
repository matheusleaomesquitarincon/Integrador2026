import { useEffect, useMemo, useRef, useState } from "react";
import { listNotes, createNote, updateNote, deleteNote } from "../services/studyNoteService";
import Icon from "../components/Icon";
import MarkdownView from "../components/MarkdownView";

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

const TOPIC_LABEL = Object.fromEntries(TOPIC_OPTIONS.map((t) => [t.value, t.label]));

const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  if (abs < 60) return rtf.format(Math.round(diffSec), "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diffSec / 2592000), "month");
  return rtf.format(Math.round(diffSec / 31536000), "year");
};

const StudyPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("outros");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const [selectedNote, setSelectedNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const titleInputRef = useRef(null);

  const loadNotes = async () => {
    try {
      const data = await listNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const resetForm = () => {
    setTitle("");
    setText("");
    setTopic("outros");
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !text.trim()) return;
    setLoading(true);
    try {
      const payload = { title: title.trim(), text: text.trim(), topic };
      if (editingId) {
        const saved = await updateNote(editingId, payload);
        setNotes((prev) => prev.map((n) => (n.id === editingId ? saved : n)));
      } else {
        const saved = await createNote(payload);
        setNotes((prev) => [saved, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setText(note.text);
    setTopic(note.topic || "outros");
    setSelectedNote(null);
    if (titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await deleteNote(noteToDelete.id);
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      if (editingId === noteToDelete.id) resetForm();
      if (selectedNote?.id === noteToDelete.id) setSelectedNote(null);
    } catch (err) {
      console.error(err);
    } finally {
      setNoteToDelete(null);
    }
  };

  const visibleNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = notes.filter((note) => {
      const matchesTopic = topicFilter === "all" || (note.topic || "outros") === topicFilter;
      if (!matchesTopic) return false;
      if (!term) return true;
      return (
        note.title.toLowerCase().includes(term) ||
        note.text.toLowerCase().includes(term)
      );
    });

    filtered = [...filtered];
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    } else if (sortBy === "topic") {
      filtered.sort((a, b) =>
        (TOPIC_LABEL[a.topic] || "Z").localeCompare(TOPIC_LABEL[b.topic] || "Z", "pt-BR")
      );
    }
    return filtered;
  }, [notes, searchTerm, topicFilter, sortBy]);

  const topicCounts = useMemo(() => {
    const counts = { all: notes.length };
    TOPIC_OPTIONS.forEach((t) => (counts[t.value] = 0));
    notes.forEach((n) => {
      const key = n.topic && counts[n.topic] !== undefined ? n.topic : "outros";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [notes]);

  return (
    <div>
      <div className="card">
        <h1 className="title">Bloco de Notas</h1>
        <p className="subtitle">
          Anotações de Java em Markdown, organizadas por tópico.
        </p>
      </div>

      <div className="notes-layout">
        {/* Coluna 1 — editor */}
        <aside className="editor-card">
          <div className={`editor-status ${editingId ? "editing" : ""}`}>
            <span>{editingId ? "Editando anotação" : "Nova anotação"}</span>
            {editingId && (
              <button type="button" className="link-button" style={{ marginTop: 0 }} onClick={resetForm}>
                Cancelar edição
              </button>
            )}
          </div>

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
              ref={titleInputRef}
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Tipos primitivos"
              maxLength={120}
            />

            <div className="label">Conteúdo</div>
            <textarea
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"# Título\n\n- Item de lista\n\n```java\nint x = 10;\n```"}
            />
            <div className="markdown-hint">
              Markdown e blocos <code>```java</code> suportados. Ctrl+Enter salva.
            </div>

            <div className="editor-actions">
              <button className="button-primary" type="submit" disabled={loading}>
                {loading
                  ? "Salvando..."
                  : editingId
                  ? "Atualizar anotação"
                  : "Salvar anotação"}
              </button>
              {!editingId && (title || text) && (
                <button type="button" className="button-secondary" onClick={resetForm}>
                  Limpar
                </button>
              )}
            </div>
          </form>
        </aside>

        {/* Coluna 2 — lista */}
        <section className="notes-list-pane">
          <div className="notes-toolbar">
            <div className="search-input-wrap">
              <span className="search-icon" aria-hidden="true">
                <Icon name="search" size={16} />
              </span>
              <input
                className="input"
                placeholder="Buscar anotações"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Limpar busca"
                  title="Limpar busca"
                >
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>
            <select
              className="select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
              <option value="title">Por título (A-Z)</option>
              <option value="topic">Por tópico</option>
            </select>
          </div>

          <div className="topic-filter">
            <button
              type="button"
              className={`topic-chip-filter ${topicFilter === "all" ? "active" : ""}`}
              onClick={() => setTopicFilter("all")}
            >
              Todas ({topicCounts.all || 0})
            </button>
            {TOPIC_OPTIONS.map((opt) => {
              const count = topicCounts[opt.value] || 0;
              if (count === 0) return null;
              return (
                <button
                  type="button"
                  key={opt.value}
                  className={`topic-chip-filter ${topicFilter === opt.value ? "active" : ""}`}
                  onClick={() => setTopicFilter(opt.value)}
                >
                  {opt.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="notes-count">
            {visibleNotes.length} de {notes.length} anotação{notes.length === 1 ? "" : "ões"}
          </div>

          {notes.length === 0 ? (
            <div className="notes-empty">
              <Icon name="notebook" size={28} className="empty-icon" />
              <strong>Nenhuma anotação ainda</strong>
              <span>Use o formulário ao lado para criar a primeira.</span>
            </div>
          ) : visibleNotes.length === 0 ? (
            <div className="notes-empty">
              <Icon name="search" size={28} className="empty-icon" />
              <strong>Nada encontrado</strong>
              <span>Ajuste a busca ou o filtro de tópico.</span>
            </div>
          ) : (
            <div className="notes-scroll">
              {visibleNotes.map((note) => (
                <article
                  key={note.id}
                  className={`note-card ${editingId === note.id ? "active" : ""}`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="note-card-header">
                    <div className="note-card-title">{note.title}</div>
                  </div>
                  <div className="note-card-preview">{note.text}</div>
                  <div className="note-card-meta">
                    <span className="topic-chip">
                      {TOPIC_LABEL[note.topic] || "Outros"}
                    </span>
                    {note.createdAt && <span>· {formatRelative(note.createdAt)}</span>}
                  </div>
                  <div className="note-card-actions">
                    <button
                      type="button"
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(note);
                      }}
                      title="Editar"
                      aria-label="Editar"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-button danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(note);
                      }}
                      title="Excluir"
                      aria-label="Excluir"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedNote && (
        <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "720px" }}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedNote(null)}
              aria-label="Fechar"
            >
              <Icon name="close" size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
              <span className="topic-chip">{TOPIC_LABEL[selectedNote.topic] || "Outros"}</span>
              {selectedNote.createdAt && (
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  {formatRelative(selectedNote.createdAt)}
                </span>
              )}
            </div>
            <h2 className="title">{selectedNote.title}</h2>
            <MarkdownView>{selectedNote.text}</MarkdownView>
            <div className="editor-actions" style={{ marginTop: "1.2rem" }}>
              <button
                type="button"
                className="button-primary"
                onClick={() => startEdit(selectedNote)}
              >
                Editar
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setSelectedNote(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {noteToDelete && (
        <div className="modal-overlay" onClick={() => setNoteToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center", maxWidth: "400px" }}>
            <h3 className="title" style={{ marginBottom: "1rem" }}>Excluir anotação?</h3>
            <p className="subtitle" style={{ marginBottom: "2rem" }}>
              Tem certeza que deseja apagar "<strong>{noteToDelete.title}</strong>"? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setNoteToDelete(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={confirmDelete}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPage;
