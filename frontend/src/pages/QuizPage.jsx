import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8080/api";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [topicFilter, setTopicFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const query = topicFilter ? `?topic=${encodeURIComponent(topicFilter)}` : "";
        const res = await fetch(`${API_BASE}/quizzes${query}`);
        const data = await res.json();
        setQuestions(data);
        setCurrentIndex(0);
        setSelectedOption("");
        setResult(null);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [topicFilter]);

  const topicOptions = useMemo(
    () => ["arrays", "vetores", "matrizes", "tabela hash", "poo", "springboot", "portugol"],
    []
  );

  const current = questions[currentIndex];

  const handleCheck = () => {
    if (!current || !selectedOption) return;
    if (selectedOption === current.correctOption) {
      setResult({ ok: true, message: "Resposta correta! Continue assim." });
    } else {
      setResult({
        ok: false,
        message: `Resposta incorreta. A alternativa correta é ${current.correctOption}.`
      });
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
        <div className="quiz-question">
          <div className="topic-chip">
            <span className="pill-dot" />
            {current.topic}
          </div>
          <p style={{ marginTop: "0.6rem" }}>{current.question}</p>

          <div className="quiz-options">
            {["A", "B", "C", "D"].map((key) => (
              <button
                type="button"
                key={key}
                className={
                  "quiz-option" + (selectedOption === key ? " selected" : "")
                }
                onClick={() => setSelectedOption(key)}
              >
                <strong>{key})</strong>{" "}
                {current[`option${key}`]}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="button-primary"
            style={{ marginTop: "0.8rem" }}
            onClick={handleCheck}
          >
            Verificar resposta
          </button>

          {result && (
            <div
              className={
                "quiz-result " + (result.ok ? "ok" : "error")
              }
            >
              {result.message}
            </div>
          )}

          {questions.length > 1 && currentIndex < questions.length - 1 && (
            <button
              type="button"
              className="button-secondary"
              style={{ marginTop: "0.6rem" }}
              onClick={handleNext}
            >
              Próxima questão
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;

