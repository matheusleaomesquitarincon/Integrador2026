import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  listQuestions,
  createQuestion,
  toggleQuestionLike,
} from "../services/communityService";
import { useCommunitySocket } from "../services/communitySocket";
import Icon from "../components/Icon";

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

const CommunityPage = () => {
  const [questions, setQuestions] = useState([]);
  const [topicFilter, setTopicFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("outros");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listQuestions(topicFilter);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [topicFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useCommunitySocket(
    [
      {
        destination: "/topic/community",
        handler: (event) => {
          if (!event || !event.type) return;
          if (event.type === "QUESTION_CREATED" && event.question) {
            setQuestions((prev) => {
              if (prev.some((q) => q.id === event.question.id)) return prev;
              return [event.question, ...prev];
            });
          } else if (event.type === "QUESTION_UPDATED" && event.question) {
            setQuestions((prev) =>
              prev.map((q) => (q.id === event.question.id ? { ...q, ...event.question } : q))
            );
          } else if (event.type === "QUESTION_DELETED") {
            setQuestions((prev) => prev.filter((q) => q.id !== event.questionId));
          } else if (event.type === "QUESTION_LIKED") {
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === event.questionId ? { ...q, likeCount: event.likeCount } : q
              )
            );
          } else if (event.type === "ANSWER_CREATED" || event.type === "ANSWER_DELETED") {
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === event.questionId
                  ? {
                      ...q,
                      answerCount:
                        event.type === "ANSWER_CREATED"
                          ? (q.answerCount || 0) + 1
                          : Math.max(0, (q.answerCount || 0) - 1),
                    }
                  : q
              )
            );
          } else if (event.type === "ANSWER_ACCEPTED" && event.answer) {
            setQuestions((prev) =>
              prev.map((q) =>
                q.id === event.questionId
                  ? { ...q, hasAcceptedAnswer: event.answer.accepted ? true : q.hasAcceptedAnswer }
                  : q
              )
            );
          }
        },
      },
    ],
    []
  );

  const visibleQuestions = useMemo(() => {
    if (topicFilter === "all") return questions;
    return questions.filter((q) => q.topic === topicFilter);
  }, [questions, topicFilter]);

  const topicCounts = useMemo(() => {
    const counts = { all: questions.length };
    TOPIC_OPTIONS.forEach((t) => (counts[t.value] = 0));
    questions.forEach((q) => {
      const key = counts[q.topic] !== undefined ? q.topic : "outros";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [questions]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFormError(null);
    if (!title.trim() || !text.trim()) {
      setFormError("Preencha título e detalhes da pergunta.");
      return;
    }
    setSaving(true);
    try {
      await createQuestion({
        title: title.trim(),
        text: text.trim(),
        topic,
      });
      setTitle("");
      setText("");
      setTopic("outros");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      if (err && err.status === 401) {
        setFormError("Sua sessão expirou. Faça login novamente.");
      } else if (err && err.status === 404) {
        setFormError("Endpoint não encontrado. O backend pode precisar ser reiniciado para carregar as novas rotas da comunidade.");
      } else if (err && err.status >= 500) {
        setFormError("Erro no servidor ao publicar. Verifique o log do backend.");
      } else if (err && err.body && err.body.message) {
        setFormError(err.body.message);
      } else {
        setFormError("Não foi possível publicar agora. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLike = async (q, ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    try {
      const updated = await toggleQuestionLike(q.id);
      setQuestions((prev) =>
        prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="card community-header">
        <div className="community-header-text">
          <h1 className="title">Comunidade</h1>
          <p className="subtitle">
            Tire dúvidas e ajude outros estudantes. Atualizado em tempo real.
            <span className="live-dot" title="Conectado" />
          </p>
        </div>
        <button
          type="button"
          className="button-primary community-header-cta"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancelar" : "Nova pergunta"}
        </button>
      </div>

      {showForm && (
        <div className="card community-form">
          <form onSubmit={handleSubmit}>
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

            <div className="label">Título da pergunta</div>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Qual a diferença entre Array e ArrayList?"
              maxLength={200}
            />

            <div className="label">Detalhes</div>
            <textarea
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Descreva sua dúvida com contexto. Você pode usar Markdown."
            />

            {formError && (
              <div className="community-form-error" role="alert">
                {formError}
              </div>
            )}

            <div className="editor-actions">
              <button className="button-primary" type="submit" disabled={saving}>
                {saving ? "Publicando..." : "Publicar pergunta"}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="topic-filter community-topic-filter">
        <button
          type="button"
          className={`topic-chip-filter ${topicFilter === "all" ? "active" : ""}`}
          onClick={() => setTopicFilter("all")}
        >
          Todas ({topicCounts.all || 0})
        </button>
        {TOPIC_OPTIONS.map((opt) => {
          const count = topicCounts[opt.value] || 0;
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

      {loading ? (
        <div className="notes-empty">Carregando perguntas...</div>
      ) : visibleQuestions.length === 0 ? (
        <div className="notes-empty">
          <Icon name="users" size={28} className="empty-icon" />
          <strong>Nenhuma pergunta por aqui ainda</strong>
          <span>Seja o primeiro a perguntar sobre {topicFilter === "all" ? "qualquer tópico" : TOPIC_LABEL[topicFilter]}.</span>
        </div>
      ) : (
        <div className="community-list">
          {visibleQuestions.map((q) => (
            <Link key={q.id} to={`/comunidade/${q.id}`} className="question-card">
              <div className="question-card-head">
                <span className="topic-chip">{TOPIC_LABEL[q.topic] || "Outros"}</span>
                {q.hasAcceptedAnswer && (
                  <span className="badge-accepted">
                    <Icon name="check" size={12} /> Resolvida
                  </span>
                )}
              </div>
              <h3 className="question-card-title">{q.title}</h3>
              <p className="question-card-text">{q.text}</p>
              <div className="question-card-meta">
                <span>{q.author?.username || "anônimo"}</span>
                <span>· {formatRelative(q.createdAt)}</span>
                <span className="question-card-stat">
                  <Icon name="message" size={14} /> {q.answerCount || 0}
                </span>
                <button
                  type="button"
                  className={`like-btn ${q.likedByMe ? "active" : ""}`}
                  onClick={(ev) => handleLike(q, ev)}
                  title={q.likedByMe ? "Remover curtida" : "Curtir"}
                >
                  <Icon name="heart" size={14} /> {q.likeCount || 0}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
