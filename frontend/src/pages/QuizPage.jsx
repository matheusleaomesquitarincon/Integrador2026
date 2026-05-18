import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  listThemes,
  getTheme,
  submitAttempt,
  listHistory,
} from "../services/quizService";
import Icon from "../components/Icon";

const OPTION_KEYS = ["A", "B", "C", "D"];

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
  return rtf.format(Math.round(diffSec / 31536000), "year");
};

const percent = (score, total) => {
  if (!total) return 0;
  return Math.round((score / total) * 100);
};

const HistorySparkline = ({ history }) => {
  if (!history || history.length < 2) return null;
  const W = 220;
  const H = 56;
  const PAD = 4;
  const points = history.map((h, i) => {
    const x = PAD + (i * (W - 2 * PAD)) / (history.length - 1 || 1);
    const pct = percent(h.score, h.total);
    const y = H - PAD - ((H - 2 * PAD) * pct) / 100;
    return { x, y, pct };
  });
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${path} L ${points[points.length - 1].x.toFixed(1)} ${H - PAD} L ${points[0].x.toFixed(1)} ${H - PAD} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      preserveAspectRatio="none"
      className="quiz-sparkline"
      aria-hidden="true"
    >
      <path d={areaPath} className="quiz-sparkline-area" />
      <path d={path} className="quiz-sparkline-line" />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 3.5 : 2}
          className={i === points.length - 1 ? "quiz-sparkline-dot last" : "quiz-sparkline-dot"}
        />
      ))}
    </svg>
  );
};

const ThemesView = ({ themes, loading, onStart }) => {
  if (loading) {
    return <div className="notes-empty">Carregando quizzes...</div>;
  }
  if (!themes.length) {
    return (
      <div className="notes-empty">
        <Icon name="alert" size={28} className="empty-icon" />
        <strong>Nenhum quiz disponível</strong>
        <span>Aguarde o backend semear os temas (ou reinicie).</span>
      </div>
    );
  }
  return (
    <div className="quiz-themes-grid">
      {themes.map((t) => {
        const hasAttempt = t.lastScore != null && t.lastTotal != null;
        const pct = hasAttempt ? percent(t.lastScore, t.lastTotal) : null;
        return (
          <article key={t.slug} className="quiz-theme-card">
            <div className="quiz-theme-head">
              <span className="quiz-theme-icon">
                <Icon name={t.icon || "helpCircle"} size={22} />
              </span>
              <div className="quiz-theme-meta">
                <span className="quiz-theme-count">{t.questionCount} perguntas</span>
                {t.attemptCount > 0 && (
                  <span className="quiz-theme-count">
                    {t.attemptCount} tentativa{t.attemptCount === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </div>

            <h3 className="quiz-theme-title">{t.title}</h3>
            <p className="quiz-theme-desc">{t.description}</p>

            {hasAttempt ? (
              <div className="quiz-theme-score">
                <div className="quiz-theme-score-row">
                  <span>Última nota</span>
                  <strong>
                    {t.lastScore}/{t.lastTotal} ({pct}%)
                  </strong>
                </div>
                <div className="quiz-progress quiz-progress-sm">
                  <div
                    className="quiz-progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {t.bestScore != null && t.bestScore !== t.lastScore && (
                  <div className="quiz-theme-best">
                    Melhor: {t.bestScore}/{t.lastTotal}
                  </div>
                )}
              </div>
            ) : (
              <div className="quiz-theme-score quiz-theme-score-empty">
                Ainda não respondido
              </div>
            )}

            <button
              type="button"
              className="button-primary quiz-theme-cta"
              onClick={() => onStart(t)}
              disabled={!t.questionCount}
            >
              {hasAttempt ? "Tentar de novo" : "Começar"}
              <Icon name="arrowRight" size={14} />
            </button>
          </article>
        );
      })}
    </div>
  );
};

const PlayView = ({ theme, onAnswer, onPrev, onSubmit, answers, current, submitting }) => {
  const total = theme.questions.length;
  const question = theme.questions[current];
  const chosen = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const isLast = current === total - 1;
  const canFinish = answeredCount === total;

  return (
    <div className="quiz-play">
      <header className="quiz-play-head">
        <div>
          <span className="quiz-theme-eyebrow">
            <Icon name={theme.icon || "helpCircle"} size={14} /> {theme.title}
          </span>
          <h2 className="quiz-play-title">
            Pergunta {current + 1} <span className="quiz-play-total">/ {total}</span>
          </h2>
        </div>
        <div className="quiz-progress">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <div className="quiz-question-text">{question.questionText}</div>

      <div className="quiz-options-grid">
        {OPTION_KEYS.map((key) => {
          const value = question[`option${key}`];
          if (value == null) return null;
          const selected = chosen === key;
          return (
            <button
              key={key}
              type="button"
              className={`quiz-option-btn ${selected ? "selected" : ""}`}
              onClick={() => onAnswer(question.id, key)}
            >
              <span className="quiz-option-key">{key}</span>
              <span className="quiz-option-text">{value}</span>
            </button>
          );
        })}
      </div>

      <footer className="quiz-play-foot">
        <button
          type="button"
          className="button-secondary"
          onClick={onPrev}
          disabled={current === 0}
        >
          ← Voltar
        </button>

        <div className="quiz-play-status">
          {answeredCount} de {total} respondidas
        </div>

        {!isLast ? (
          <button
            type="button"
            className="button-primary"
            onClick={() => onAnswer(question.id, chosen, true)}
            disabled={!chosen}
          >
            Próxima
            <Icon name="arrowRight" size={14} />
          </button>
        ) : (
          <button
            type="button"
            className="button-primary"
            onClick={onSubmit}
            disabled={!canFinish || submitting}
          >
            {submitting ? "Enviando..." : "Finalizar"}
            <Icon name="check" size={14} />
          </button>
        )}
      </footer>
    </div>
  );
};

const ResultView = ({ theme, result, history, onRetry, onExit }) => {
  const pct = percent(result.score, result.total);
  const passed = pct >= 70;
  const resultsById = useMemo(() => {
    const m = {};
    result.results.forEach((r) => {
      m[r.questionId] = r;
    });
    return m;
  }, [result]);

  return (
    <div className="quiz-result">
      <header className="quiz-result-head">
        <span className={`quiz-result-badge ${passed ? "good" : "ok"}`}>
          {passed ? "Mandou bem!" : "Continue praticando"}
        </span>
        <h2 className="title quiz-result-title">{theme.title}</h2>
        <div className="quiz-result-score">
          <span className="quiz-result-score-big">{result.score}</span>
          <span className="quiz-result-score-sep">/ {result.total}</span>
          <span className="quiz-result-pct">{pct}%</span>
        </div>
      </header>

      {history.length >= 2 && (
        <section className="quiz-result-history">
          <div className="quiz-result-history-head">
            <strong>Sua evolução</strong>
            <span>
              {history.length} tentativa{history.length === 1 ? "" : "s"}
            </span>
          </div>
          <HistorySparkline history={history} />
          <div className="quiz-result-history-foot">
            <span>Primeira: {history[0].score}/{history[0].total}</span>
            <span>Última: {history[history.length - 1].score}/{history[history.length - 1].total}</span>
          </div>
        </section>
      )}

      <section className="quiz-result-answers">
        <h3>Revisão das respostas</h3>
        {theme.questions.map((q, idx) => {
          const r = resultsById[q.id];
          if (!r) return null;
          return (
            <article
              key={q.id}
              className={`quiz-review-card ${r.correctChoice ? "ok" : "bad"}`}
            >
              <header>
                <span className="quiz-review-num">{idx + 1}</span>
                <span className="quiz-review-title">{q.questionText}</span>
                <span className="quiz-review-flag">
                  {r.correctChoice ? (
                    <>
                      <Icon name="check" size={14} /> Acertou
                    </>
                  ) : (
                    <>
                      <Icon name="close" size={14} /> Errou
                    </>
                  )}
                </span>
              </header>
              <div className="quiz-review-options">
                {OPTION_KEYS.map((k) => {
                  const v = q[`option${k}`];
                  if (v == null) return null;
                  const isChosen = r.chosen === k;
                  const isCorrect = r.correct === k;
                  let cls = "quiz-review-option";
                  if (isCorrect) cls += " correct";
                  else if (isChosen) cls += " wrong";
                  return (
                    <div key={k} className={cls}>
                      <span className="quiz-option-key">{k}</span>
                      <span className="quiz-option-text">{v}</span>
                      {isCorrect && <Icon name="check" size={14} />}
                      {isChosen && !isCorrect && <Icon name="close" size={14} />}
                    </div>
                  );
                })}
              </div>
              {r.explanation && (
                <p className="quiz-review-exp">
                  <Icon name="lightbulb" size={14} /> {r.explanation}
                </p>
              )}
            </article>
          );
        })}
      </section>

      <footer className="quiz-result-foot">
        <button type="button" className="button-secondary" onClick={onExit}>
          Voltar aos temas
        </button>
        <button type="button" className="button-primary" onClick={onRetry}>
          Tentar de novo
          <Icon name="arrowRight" size={14} />
        </button>
      </footer>
    </div>
  );
};

const fireConfettiBurst = () => {
  confetti({
    particleCount: 120,
    spread: 75,
    origin: { y: 0.4 },
    ticks: 200,
    zIndex: 9999,
  });
};

const QuizPage = () => {
  const [themes, setThemes] = useState([]);
  const [loadingThemes, setLoadingThemes] = useState(true);

  const [activeTheme, setActiveTheme] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const loadThemes = useCallback(async () => {
    setLoadingThemes(true);
    try {
      const data = await listThemes();
      setThemes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      if (e && e.status === 401) {
        setError("Sua sessão expirou. Será redirecionado para o login.");
      } else if (e && e.status === 404) {
        setError("Os quizzes ainda não foram carregados pelo backend. Tente reiniciar o servidor.");
      } else if (e && e.status >= 500) {
        setError("O servidor retornou um erro. Verifique o log do backend.");
      } else {
        setError("Não foi possível carregar os quizzes.");
      }
    } finally {
      setLoadingThemes(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  const handleStart = async (themeSummary) => {
    setError(null);
    try {
      const detail = await getTheme(themeSummary.slug);
      setActiveTheme(detail);
      setAnswers({});
      setCurrent(0);
      setResult(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error(e);
      setError("Não foi possível abrir esse quiz.");
    }
  };

  const handleAnswer = (questionId, choice, advance = false) => {
    if (!choice) return;
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
    if (advance && current < activeTheme.questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const handlePrev = () => {
    setCurrent((c) => Math.max(0, c - 1));
  };

  const handleSubmit = async () => {
    if (!activeTheme) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = Object.entries(answers).map(([qid, choice]) => ({
        questionId: Number(qid),
        choice,
      }));
      const res = await submitAttempt(activeTheme.slug, payload);
      const hist = await listHistory(activeTheme.slug);
      setResult(res);
      setHistory(Array.isArray(hist) ? hist : []);
      if (res.score === res.total) {
        setTimeout(fireConfettiBurst, 200);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error(e);
      setError("Não foi possível enviar suas respostas. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrent(0);
    setResult(null);
  };

  const handleExit = async () => {
    setActiveTheme(null);
    setResult(null);
    setAnswers({});
    setCurrent(0);
    setHistory([]);
    await loadThemes();
  };

  // ---------- render ----------

  if (!activeTheme) {
    return (
      <div>
        <div className="card quiz-header-card">
          <h1 className="title">Quiz</h1>
          <p className="subtitle">
            Escolha um tema e teste seu conhecimento. Cada quiz tem 5 perguntas.
          </p>
        </div>
        {error && <div className="quiz-error">{error}</div>}
        <ThemesView themes={themes} loading={loadingThemes} onStart={handleStart} />
      </div>
    );
  }

  if (result) {
    return (
      <div className="card quiz-card-wide">
        <ResultView
          theme={activeTheme}
          result={result}
          history={history}
          onRetry={handleRetry}
          onExit={handleExit}
        />
      </div>
    );
  }

  return (
    <div className="card quiz-card-wide">
      <button type="button" className="link-button quiz-exit-link" onClick={handleExit}>
        ← Sair do quiz
      </button>
      {error && <div className="quiz-error">{error}</div>}
      <PlayView
        theme={activeTheme}
        answers={answers}
        current={current}
        submitting={submitting}
        onAnswer={handleAnswer}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default QuizPage;
