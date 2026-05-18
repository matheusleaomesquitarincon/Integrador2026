import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getQuestion,
  listAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  toggleAnswerLike,
  acceptAnswer,
  toggleQuestionLike,
  updateQuestion,
  deleteQuestion,
} from "../services/communityService";
import { useCommunitySocket } from "../services/communitySocket";
import { useAuth } from "../contexts/AuthContext";
import Icon from "../components/Icon";
import MarkdownView from "../components/MarkdownView";

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
  return rtf.format(Math.round(diffSec / 31536000), "year");
};

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const [newAnswer, setNewAnswer] = useState("");
  const [posting, setPosting] = useState(false);

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");

  const [editQuestionOpen, setEditQuestionOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editTopic, setEditTopic] = useState("outros");

  const [confirmDeleteQ, setConfirmDeleteQ] = useState(false);
  const [confirmDeleteAnswer, setConfirmDeleteAnswer] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMissing(false);
    try {
      const [q, a] = await Promise.all([getQuestion(id), listAnswers(id)]);
      setQuestion(q);
      setAnswers(Array.isArray(a) ? a : []);
    } catch (err) {
      if (err && err.status === 404) {
        setMissing(true);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useCommunitySocket(
    [
      {
        destination: `/topic/community/question/${id}`,
        handler: (event) => {
          if (!event || !event.type) return;
          if (event.type === "QUESTION_UPDATED" && event.question) {
            setQuestion((prev) => ({ ...(prev || {}), ...event.question }));
          } else if (event.type === "QUESTION_DELETED") {
            setMissing(true);
          } else if (event.type === "QUESTION_LIKED") {
            setQuestion((prev) =>
              prev ? { ...prev, likeCount: event.likeCount } : prev
            );
          } else if (event.type === "ANSWER_CREATED" && event.answer) {
            setAnswers((prev) => {
              if (prev.some((a) => a.id === event.answer.id)) return prev;
              return [...prev, event.answer];
            });
            setQuestion((prev) =>
              prev ? { ...prev, answerCount: (prev.answerCount || 0) + 1 } : prev
            );
          } else if (event.type === "ANSWER_UPDATED" && event.answer) {
            setAnswers((prev) =>
              prev.map((a) => (a.id === event.answer.id ? { ...a, ...event.answer } : a))
            );
          } else if (event.type === "ANSWER_DELETED") {
            setAnswers((prev) => prev.filter((a) => a.id !== event.answerId));
            setQuestion((prev) =>
              prev
                ? { ...prev, answerCount: Math.max(0, (prev.answerCount || 0) - 1) }
                : prev
            );
          } else if (event.type === "ANSWER_LIKED") {
            setAnswers((prev) =>
              prev.map((a) =>
                a.id === event.answerId ? { ...a, likeCount: event.likeCount } : a
              )
            );
          } else if (event.type === "ANSWER_ACCEPTED" && event.answer) {
            setAnswers((prev) =>
              prev.map((a) =>
                a.id === event.answer.id
                  ? { ...a, accepted: event.answer.accepted }
                  : event.answer.accepted
                  ? { ...a, accepted: false }
                  : a
              )
            );
            setQuestion((prev) =>
              prev ? { ...prev, hasAcceptedAnswer: event.answer.accepted } : prev
            );
          }
        },
      },
    ],
    [id]
  );

  const sortedAnswers = useMemo(() => {
    return [...answers].sort((a, b) => {
      if (a.accepted !== b.accepted) return a.accepted ? -1 : 1;
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    });
  }, [answers]);

  const isQuestionOwner = user && question && user.id === question.author?.id;

  const handlePostAnswer = async (e) => {
    e?.preventDefault();
    if (!newAnswer.trim()) return;
    setPosting(true);
    try {
      await createAnswer(id, { text: newAnswer.trim() });
      setNewAnswer("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleQuestionLike = async () => {
    try {
      const updated = await toggleQuestionLike(id);
      setQuestion((prev) => ({ ...(prev || {}), ...updated }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerLike = async (answerId) => {
    try {
      const updated = await toggleAnswerLike(answerId);
      setAnswers((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      const updated = await acceptAnswer(answerId);
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === updated.id
            ? { ...a, accepted: updated.accepted }
            : updated.accepted
            ? { ...a, accepted: false }
            : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const startEditAnswer = (answer) => {
    setEditingAnswerId(answer.id);
    setEditingAnswerText(answer.text);
  };

  const saveEditAnswer = async () => {
    if (!editingAnswerText.trim()) return;
    try {
      const updated = await updateAnswer(editingAnswerId, {
        text: editingAnswerText.trim(),
      });
      setAnswers((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
      );
      setEditingAnswerId(null);
      setEditingAnswerText("");
    } catch (err) {
      console.error(err);
    }
  };

  const openEditQuestion = () => {
    if (!question) return;
    setEditTitle(question.title);
    setEditText(question.text);
    setEditTopic(question.topic);
    setEditQuestionOpen(true);
  };

  const saveEditQuestion = async (e) => {
    e?.preventDefault();
    if (!editTitle.trim() || !editText.trim()) return;
    try {
      const updated = await updateQuestion(id, {
        title: editTitle.trim(),
        text: editText.trim(),
        topic: editTopic,
      });
      setQuestion((prev) => ({ ...(prev || {}), ...updated }));
      setEditQuestionOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await deleteQuestion(id);
      navigate("/comunidade");
    } catch (err) {
      console.error(err);
      setConfirmDeleteQ(false);
    }
  };

  const handleDeleteAnswer = async () => {
    if (!confirmDeleteAnswer) return;
    try {
      await deleteAnswer(confirmDeleteAnswer.id);
      setAnswers((prev) => prev.filter((a) => a.id !== confirmDeleteAnswer.id));
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDeleteAnswer(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p>Carregando pergunta...</p>
      </div>
    );
  }

  if (missing || !question) {
    return (
      <div className="card">
        <h2 className="title">Pergunta não encontrada</h2>
        <p className="subtitle">Pode ter sido removida pelo autor.</p>
        <Link to="/comunidade" className="button-secondary community-back-cta">
          Voltar para comunidade
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="community-back">
        <Link to="/comunidade" className="link-button">
          ← Voltar para a comunidade
        </Link>
      </div>

      <article className="card question-detail">
        <div className="question-detail-head">
          <span className="topic-chip">{TOPIC_LABEL[question.topic] || "Outros"}</span>
          {question.hasAcceptedAnswer && (
            <span className="badge-accepted">
              <Icon name="check" size={12} /> Resolvida
            </span>
          )}
          <span className="live-dot" title="Atualização ao vivo" />
        </div>

        {!editQuestionOpen ? (
          <>
            <h1 className="title question-detail-title">{question.title}</h1>
            <div className="question-meta">
              <span><strong>{question.author?.username || "anônimo"}</strong></span>
              <span>· {formatRelative(question.createdAt)}</span>
              {question.updatedAt && (
                <span className="meta-edited">· editada {formatRelative(question.updatedAt)}</span>
              )}
            </div>
            <div className="question-body">
              <MarkdownView>{question.text}</MarkdownView>
            </div>

            <div className="question-actions">
              <button
                type="button"
                className={`like-btn ${question.likedByMe ? "active" : ""}`}
                onClick={handleQuestionLike}
              >
                <Icon name="heart" size={14} /> {question.likeCount || 0}
              </button>
              {isQuestionOwner && (
                <>
                  <button type="button" className="button-secondary" onClick={openEditQuestion}>
                    <Icon name="edit" size={14} /> Editar
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => setConfirmDeleteQ(true)}
                  >
                    <Icon name="trash" size={14} /> Excluir
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={saveEditQuestion} className="question-edit-form">
            <div className="label">Tópico</div>
            <select
              className="select"
              value={editTopic}
              onChange={(e) => setEditTopic(e.target.value)}
            >
              {TOPIC_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="label">Título</div>
            <input
              className="input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={200}
            />
            <div className="label">Detalhes</div>
            <textarea
              className="textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="editor-actions">
              <button type="submit" className="button-primary">Salvar</button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setEditQuestionOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </article>

      <h2 className="answers-heading">
        {answers.length === 0
          ? "Nenhuma resposta ainda"
          : `${answers.length} resposta${answers.length === 1 ? "" : "s"}`}
      </h2>

      <div className="answers-list">
        {sortedAnswers.map((answer) => {
          const isOwner = user && user.id === answer.author?.id;
          const isEditing = editingAnswerId === answer.id;
          return (
            <article
              key={answer.id}
              className={`answer-card ${answer.accepted ? "accepted" : ""}`}
            >
              <div className="answer-head">
                <span><strong>{answer.author?.username || "anônimo"}</strong></span>
                <span>· {formatRelative(answer.createdAt)}</span>
                {answer.updatedAt && (
                  <span className="meta-edited">
                    · editada {formatRelative(answer.updatedAt)}
                  </span>
                )}
                {answer.accepted && (
                  <span className="badge-accepted">
                    <Icon name="check" size={12} /> Aceita
                  </span>
                )}
              </div>

              {isEditing ? (
                <>
                  <textarea
                    className="textarea"
                    value={editingAnswerText}
                    onChange={(e) => setEditingAnswerText(e.target.value)}
                  />
                  <div className="editor-actions">
                    <button type="button" className="button-primary" onClick={saveEditAnswer}>
                      Salvar
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => {
                        setEditingAnswerId(null);
                        setEditingAnswerText("");
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <div className="answer-body">
                  <MarkdownView>{answer.text}</MarkdownView>
                </div>
              )}

              {!isEditing && (
                <div className="answer-actions">
                  <button
                    type="button"
                    className={`like-btn ${answer.likedByMe ? "active" : ""}`}
                    onClick={() => handleAnswerLike(answer.id)}
                  >
                    <Icon name="heart" size={14} /> {answer.likeCount || 0}
                  </button>
                  {isQuestionOwner && (
                    <button
                      type="button"
                      className={`button-secondary ${answer.accepted ? "active-accept" : ""}`}
                      onClick={() => handleAcceptAnswer(answer.id)}
                    >
                      <Icon name="check" size={14} />{" "}
                      {answer.accepted ? "Desmarcar" : "Aceitar resposta"}
                    </button>
                  )}
                  {isOwner && (
                    <>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => startEditAnswer(answer)}
                        title="Editar"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-button danger"
                        onClick={() => setConfirmDeleteAnswer(answer)}
                        title="Excluir"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <form className="card answer-form" onSubmit={handlePostAnswer}>
        <div className="label">Sua resposta</div>
        <textarea
          className="textarea"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Compartilhe o que você sabe. Markdown e blocos ```java suportados."
        />
        <div className="editor-actions">
          <button type="submit" className="button-primary" disabled={posting}>
            {posting ? "Enviando..." : "Responder"}
          </button>
        </div>
      </form>

      {confirmDeleteQ && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteQ(false)}>
          <div
            className="modal-content community-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="community-confirm-title">Excluir pergunta?</h3>
            <p className="community-confirm-text">
              Todas as respostas também serão removidas. Esta ação não pode ser desfeita.
            </p>
            <div className="community-confirm-actions">
              <button type="button" className="button-secondary" onClick={() => setConfirmDeleteQ(false)}>
                Cancelar
              </button>
              <button type="button" className="danger-button" onClick={handleDeleteQuestion}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteAnswer && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteAnswer(null)}>
          <div
            className="modal-content community-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="community-confirm-title">Excluir resposta?</h3>
            <p className="community-confirm-text">
              Esta ação não pode ser desfeita.
            </p>
            <div className="community-confirm-actions">
              <button type="button" className="button-secondary" onClick={() => setConfirmDeleteAnswer(null)}>
                Cancelar
              </button>
              <button type="button" className="danger-button" onClick={handleDeleteAnswer}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;
