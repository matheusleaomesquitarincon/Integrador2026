import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/api";

const ContentPage = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/contents`);
        const data = await res.json();
        setTopics(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div className="card">
      <h1 className="title">Conteúdos de Java</h1>
      <p className="subtitle">
        Explore os principais assuntos para estudar: arrays, vetores, matrizes, tabela
        hash, POO, Spring Boot e Portugol.
      </p>

      <div className="grid">
        {topics.map((t) => (
          <div key={t.id} className="note-item">
            <div className="note-title">{t.title}</div>
            <div className="note-text">{t.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPage;

