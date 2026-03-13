import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/api";

const StudyPage = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text })
      });
      setTitle("");
      setText("");
      await loadNotes();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="title">Área de estudo</h1>
      <p className="subtitle">
        Crie anotações com título e texto para organizar seus estudos de Java.
      </p>

      <form onSubmit={handleSave} style={{ marginTop: "1rem" }}>
        <div className="label">Tópico</div>
        <input
          className="input"
          placeholder="Ex: Arrays em Java"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="label">Anotação</div>
        <textarea
          className="textarea"
          placeholder="Escreva aqui suas anotações..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="button-primary" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar anotação"}
        </button>
      </form>

      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <div className="note-title">{note.title}</div>
            <div className="note-text">{note.text}</div>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="subtitle" style={{ marginTop: "0.6rem" }}>
            Nenhuma anotação ainda. Crie a primeira acima.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudyPage;

