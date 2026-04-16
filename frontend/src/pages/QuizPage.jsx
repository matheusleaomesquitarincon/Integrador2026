import { useEffect, useMemo, useState } from "react";
import { listQuestions, validateAnswer } from "../services/quizService";

const QuizPage = () => {
  const [topicFilter, setTopicFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listQuestions(topicFilter);
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setCurrentIndex(0);
        setSelectedOption("");
        setResult(null);
      }
    };
    load();
  }, [topicFilter]);

  const topicOptions = useMemo(
    () => ["arrays", "vetores", "matrizes", "tabelas-hash", "poo", "springboot", "portugol"],
    []
  );

  const current = questions[currentIndex];

  const handleCheck = async () => {
    if (!current || !selectedOption) return;

    try {
      const isCorrect = await validateAnswer(current.id, selectedOption);

      if (isCorrect) {
        setResult({ ok: true, message: "Resposta correta! Continue assim." });
      } else {
        setResult({ ok: false, message: "Resposta incorreta. Tente novamente!" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption("");
      setResult(null);
    }
  };

  return (
    <div className="card">
      <h1 className="title">Quiz de Java</h1>
      <p className="subtitle">
        Selecione um assunto e responda as questões para testar seu conhecimento.
      </p>

      <div style={{ marginTop: "1rem" }}>
        <div className="label">Filtrar por assunto</div>
        <select
          className="select"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        >
          <option value="">Todos os assuntos</option>
          {topicOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {!current && (
        <p className="subtitle" style={{ marginTop: "0.8rem", color: "#a1a1aa" }}>
          Nenhuma questão encontrada para esse filtro ainda.
        </p>
      )}

      {current && (
        <div className="quiz-question" style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #333", borderRadius: "12px", backgroundColor: "#1e1e2e" }}>
          <div className="topic-chip" style={{ display: "inline-block", padding: "0.3rem 0.8rem", backgroundColor: "#3b82f6", color: "#fff", borderRadius: "16px", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "1rem" }}>
            {current.topic.toUpperCase()}
          </div>

          <h2 style={{ marginTop: "0.6rem", fontSize: "1.3rem", lineHeight: "1.5", color: "#fff" }}>
            {current.questionText}
          </h2>

          <div className="quiz-options" style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1.5rem" }}>
            {["A", "B", "C", "D"].map((key) => (
              <button
                type="button"
                key={key}
                className={`quiz-option ${selectedOption === key ? "selected" : ""}`}
                onClick={() => setSelectedOption(key)}
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderRadius: "8px",
                  border: selectedOption === key ? "2px solid #a78bfa" : "1px solid #444",
                  backgroundColor: selectedOption === key ? "rgba(167, 139, 250, 0.1)" : "transparent",
                  color: "#d4d4d8",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
              >
                <strong style={{ color: selectedOption === key ? "#a78bfa" : "#fff", marginRight: "10px" }}>{key})</strong>
                {current[`option${key}`]}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="button-primary"
            style={{ marginTop: "1.5rem", width: "100%", padding: "1rem" }}
            onClick={handleCheck}
            disabled={!selectedOption}
          >
            Verificar resposta
          </button>

          {result && (
            <div
              className={`quiz-result ${result.ok ? "ok" : "error"}`}
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: result.ok ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: result.ok ? "#4ade80" : "#f87171",
                border: `1px solid ${result.ok ? "#22c55e" : "#ef4444"}`
              }}
            >
              {result.message}
            </div>
          )}

          {result && currentIndex < questions.length - 1 && (
            <button
              type="button"
              className="button-secondary"
              style={{ marginTop: "1rem", width: "100%", padding: "1rem", backgroundColor: "transparent", border: "1px solid #a78bfa", color: "#a78bfa", borderRadius: "8px", cursor: "pointer" }}
              onClick={handleNext}
            >
              Próxima questão ➔
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
