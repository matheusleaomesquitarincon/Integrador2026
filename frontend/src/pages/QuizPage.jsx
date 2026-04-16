import { useEffect, useMemo, useState } from "react";
// import { apiUrl } from "../config/api";

const API_BASE = "VITE_API_BASE_URL";
 
// MOCK
const MOCK_QUESTIONS = [
  {
    id: 1,
    topic: "arrays",
    questionText: "Qual é o índice do primeiro elemento de um array em Java?",
    optionA: "0",
    optionB: "1",
    optionC: "-1",
    optionD: "Depende do tipo do array",
    correctOption: "A" 
  },
  {
    id: 2,
    topic: "vetores",
    questionText: "Qual é a principal diferença da classe Vector em relação a um array comum e ArrayList?",
    optionA: "Não permite tipos primitivos",
    optionB: "É sincronizada por padrão (Thread-safe)",
    optionC: "Possui tamanho fixo",
    optionD: "Só armazena Strings",
    correctOption: "B"
  },
  {
    id: 3,
    topic: "matrizes",
    questionText: "Como declaramos uma matriz (array bidimensional) de inteiros em Java?",
    optionA: "int matriz[];",
    optionB: "int[][] matriz;",
    optionC: "int matriz[2];",
    optionD: "Matrix<int> matriz;",
    correctOption: "B"
  },
  {
    id: 4,
    topic: "tabelas-hash",
    questionText: "Qual classe em Java é a implementação mais comum de uma tabela hash?",
    optionA: "ArrayList",
    optionB: "LinkedList",
    optionC: "HashMap",
    optionD: "TreeSet",
    correctOption: "C"
  },
  {
    id: 5,
    topic: "poo",
    title: "poo",
    questionText: "Qual pilar da POO consiste em ocultar os detalhes internos de funcionamento de uma classe?",
    optionA: "Herança",
    optionB: "Polimorfismo",
    optionC: "Abstração",
    optionD: "Encapsulamento",
    correctOption: "D"
  },
  {
    id: 6,
    topic: "springboot",
    questionText: "Qual é a principal anotação utilizada para marcar a classe principal que inicia uma aplicação Spring Boot?",
    optionA: "@SpringBootApplication",
    optionB: "@Configuration",
    optionC: "@EnableAutoConfiguration",
    optionD: "@SpringApplication",
    correctOption: "A"
  }
];

const QuizPage = () => {
  const [topicFilter, setTopicFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);

  // MOCK COM LOCALSTORAGE (Persistência)
  const [allQuestions, setAllQuestions] = useState(() => {
    const saved = localStorage.getItem("quizbyte_questions_mock");
    if (saved) {
      return JSON.parse(saved);
    }
    return MOCK_QUESTIONS;
  });

  useEffect(() => {
    localStorage.setItem("quizbyte_questions_mock", JSON.stringify(allQuestions));
  }, [allQuestions]);

  const questions = topicFilter 
    ? allQuestions.filter(q => q.topic === topicFilter)
    : allQuestions;

  // BACKEND 
  /*
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const query = topicFilter ? `?topic=${encodeURIComponent(topicFilter)}` : "";
        const res = await fetch(apiUrl(`/quizzes${query}`));
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
        setCurrentIndex(0);
        setSelectedOption("");
        setResult(null);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [topicFilter]);
  */

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption("");
    setResult(null);
  }, [topicFilter]);

  const topicOptions = useMemo(
    () => ["arrays", "vetores", "matrizes", "tabelas-hash", "poo", "springboot", "portugol"],
    []
  );

  const current = questions[currentIndex];

  const handleCheck = async () => {
    if (!current || !selectedOption) return;

    // BACKEND
    /*
    try {
      const response = await fetch(apiUrl(`/quizzes/${current.id}/validate`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedOption) // Envia apenas "A", "B", etc.
      });
      const isCorrect = await response.json();
      
      if (isCorrect) {
        setResult({ ok: true, message: "Resposta correta! Continue assim." });
      } else {
        setResult({ ok: false, message: "Resposta incorreta. Tente novamente!" });
      }
    } catch (e) {
      console.error(e);
    }
    */

    // MOCk
    if (selectedOption === current.correctOption) {
      setResult({ ok: true, message: "Resposta correta! Continue assim." });
    } else {
      setResult({
        ok: false,
        message: `Resposta incorreta. A alternativa correta é a letra ${current.correctOption}.`
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
            {/* Utilizando questionText  */}
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