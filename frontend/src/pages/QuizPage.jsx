import { useEffect, useMemo, useState } from "react";
import { listQuestions, validateAnswer } from "../services/quizService";
import Icon from "../components/Icon";

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
        setQuestions(Array.isArray(data) ? data : []);
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
        <p className="subtitle" style={{ marginTop: "0.8rem" }}>
          Nenhuma questão encontrada para esse filtro ainda.
        </p>
      )}

      {current && (
        <div
          className="quiz-question"
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            backgroundColor: "var(--surface-soft)"
          }}
        >
          <div className="topic-chip" style={{ marginBottom: "1rem" }}>
            {current.topic.toUpperCase()}
          </div>

          <h2 style={{ marginTop: "0.6rem", fontSize: "1.3rem", lineHeight: "1.5", color: "var(--text)" }}>
            {current.questionText}
          </h2>

          <div className="quiz-options" style={{ gap: "0.8rem", marginTop: "1.5rem" }}>
            {["A", "B", "C", "D"].map((key) => (
              <button
                type="button"
                key={key}
                className={`quiz-option ${selectedOption === key ? "selected" : ""}`}
                onClick={() => setSelectedOption(key)}
                style={{ padding: "1rem" }}
              >
                <strong
                  style={{
                    color: selectedOption === key ? "var(--primary)" : "var(--text)",
                    marginRight: "10px"
                  }}
                >
                  {key})
                </strong>
                {current[`option${key}`]}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="button-primary"
            style={{ marginTop: "1.5rem", width: "100%", padding: "1rem", justifyContent: "center" }}
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
                backgroundColor: result.ok ? "var(--success-bg)" : "var(--error-bg)",
                border: `1px solid ${result.ok ? "var(--success)" : "var(--error)"}`
              }}
            >
              {result.message}
            </div>
          )}

          {result && currentIndex < questions.length - 1 && (
            <button
              type="button"
              className="button-secondary"
              style={{
                marginTop: "1rem",
                width: "100%",
                padding: "1rem",
                borderColor: "var(--primary)",
                color: "var(--primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
              onClick={handleNext}
            >
              Próxima questão
              <Icon name="arrowRight" size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
