import { useState, useEffect } from "react";
//import { apiUrl } from "../config/api"; 

const API_BASE = "VITE_API_BASE_URL"; 

const StudyPage = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("quizbyte_notes_mock");
    return savedNotes ? JSON.parse(savedNotes) : []; 
  });

  useEffect(() => {
    localStorage.setItem("quizbyte_notes_mock", JSON.stringify(notes));
  }, [notes]);

  // Código do Backend
  /*
  const loadNotes = async () => {
    try {
      const res = await fetch(apiUrl("/notes"));
      const data = await res.json();
      setNotes(data);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { loadNotes(); }, []);
  */

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const newNote = { id: Date.now(), title: title.trim(), text: text.trim() };
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      setTitle(""); setText(""); setLoading(false);
    }, 500); 
  };

  const askDelete = (e, note) => {
    e.stopPropagation(); 
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setNotes(notes.filter(n => n.id !== noteToDelete.id));
    setDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  const filteredNotes = notes.filter((note) => {
    const termoLower = searchTerm.toLowerCase();
    return note.title.toLowerCase().includes(termoLower) || note.text.toLowerCase().includes(termoLower);
  });

  const hasExpandButton = filteredNotes.length > 3;
  const isScrollable = filteredNotes.length > 6;
  const displayedNotes = hasExpandButton && !showAllNotes ? filteredNotes.slice(0, 1) : filteredNotes;

  return (
    <div className="card">
      <h1 className="title">Área de estudo</h1>
      
      <form onSubmit={handleSave} style={{ marginTop: "1rem" }}>
        <div className="label">Tópico</div>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Arrays" />
        <div className="label">Anotação</div>
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Sua nota..." />
        <button className="button-primary" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar anotação"}
        </button>
      </form>

      <div className="notes-section" style={{ marginTop: "3rem" }}>
        {notes.length > 0 && (
          <input 
            className="input" 
            placeholder="🔍 Pesquisar..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setShowAllNotes(true); }} 
          />
        )}

        <div 
          className="notes-list" 
          style={{ 
            marginTop: "1.5rem",
            maxHeight: (isScrollable && showAllNotes) ? "400px" : "none",
            overflowY: (isScrollable && showAllNotes) ? "auto" : "visible",
            position: "relative"
          }}
        >
          {displayedNotes.map((note) => (
            <div 
              key={note.id} 
              className="note-item" 
              onClick={() => setSelectedNote(note)} 
              style={{ cursor: "pointer", position: "relative" }}
            >
              <div className="note-title">{note.title}</div>
              <div className="note-text" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", paddingRight: "30px" }}>
                {note.text}
              </div>
              
              {/* BOTÃO DE LIXEIRA */}
              <button 
                onClick={(e) => askDelete(e, note)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  opacity: 0.6
                }}
                title="Excluir nota"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {hasExpandButton && searchTerm === "" && (
          <button 
            className="button-link" 
            onClick={() => setShowAllNotes(!showAllNotes)}
            style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", marginTop: "10px" }}
          >
            {showAllNotes ? "Ver menos" : `Ver todas as ${filteredNotes.length} anotações`}
          </button>
        )}
      </div>

      {/* MODAL DE DETALHE */}
      {selectedNote && (
        <div className="modal-overlay" onClick={() => setSelectedNote(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: "#1e1e2e", padding: "2rem", borderRadius: "12px", maxWidth: "500px", width: "90%", position: "relative" }}>
            <button onClick={() => setSelectedNote(null)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            <h2 className="title">{selectedNote.title}</h2>
            <p className="note-text" style={{ whiteSpace: "pre-wrap" }}>{selectedNote.text}</p>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {deleteModalOpen && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
          <div className="modal-content" style={{ backgroundColor: "#1e1e2e", padding: "2rem", borderRadius: "12px", textAlign: "center", maxWidth: "400px", width: "90%" }}>
            <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Excluir Anotação?</h3>
            <p style={{ color: "#a1a1aa", marginBottom: "2rem" }}>
              Tem certeza que deseja apagar "<strong>{noteToDelete?.title}</strong>"? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                style={{ padding: "0.8rem 1.5rem", borderRadius: "8px", border: "1px solid #333", background: "none", color: "#fff", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                style={{ padding: "0.8rem 1.5rem", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: "bold" }}
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