import { useState, useEffect } from "react";
import { listContents } from "../services/contentService";

const TOPIC_OPTIONS = [
  { value: "arrays", label: "Array" },
  { value: "vetores", label: "Vetores" },
  { value: "matrizes", label: "Matrizes" },
  { value: "tabelas-hash", label: "Tabela Hash" },
  { value: "poo", label: "Programação orientada a objetos" },
  { value: "springboot", label: "Spring Boot" },
  { value: "portugol", label: "Portugol" },
];

const ContentPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0].value);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listContents();
        setTopics(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const visibleTopics = topics.filter((topic) => topic.slug === selectedTopic);

  return (
    <div className="card">
      <h1 className="title">Conteúdos de Java</h1>
      <p className="subtitle">
        Explore os principais assuntos para estudar: arrays, vetores, matrizes, tabela
        hash, POO, Spring Boot e Portugol.
      </p>

      <div className="floating-topic-tabs">
        {TOPIC_OPTIONS.map((topicOption) => (
          <button
            key={topicOption.value}
            type="button"
            className={`floating-topic-tab ${
              selectedTopic === topicOption.value ? "active" : ""
            }`}
            onClick={() => setSelectedTopic(topicOption.value)}
          >
            {topicOption.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {visibleTopics.map((t) => (
          <div key={t.id} className="note-item" style={{ marginTop: "2rem" }}>
            <h2 className="note-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t.title}</h2>

            {t.description.split("\n\n").map((paragraph, index) => (
              <p key={index} className="note-text" style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        {visibleTopics.length === 0 && (
          <p className="subtitle" style={{ marginTop: "2rem" }}>
            Conteúdo não encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
