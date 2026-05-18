import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { listContents } from "../services/contentService";
import MarkdownView from "../components/MarkdownView";
import Icon from "../components/Icon";
import QuickNoteOrb from "../components/QuickNoteOrb";
import { useProgress } from "../contexts/ProgressContext";

const ContentDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isCompleted, toggle } = useProgress();

  const handleCompletionClick = () => {
    if (isCompleted(slug)) {
      toggle(slug);
      return;
    }
    toggle(slug);
    navigate("/conteudos", { state: { celebrate: slug } });
  };

  useEffect(() => {
    setLoading(true);
    listContents()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const found = list.find((t) => t.slug === slug);
        setTopic(found || null);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="auth-loading">Carregando conteúdo...</div>;
  }

  if (!topic) {
    return (
      <div className="card">
        <h1 className="title">Conteúdo não encontrado</h1>
        <p className="subtitle">Este tópico ainda não foi publicado no banco.</p>
        <Link to="/conteudos" className="button-secondary" style={{ marginTop: "1rem", display: "inline-block" }}>
          Voltar para trilhas
        </Link>
      </div>
    );
  }

  const done = isCompleted(slug);

  return (
    <div className="content-detail">
      <Link
        to="/conteudos"
        state={{ fromSlug: slug }}
        className="trail-back content-detail-back"
      >
        <Icon name="chevronRight" size={14} style={{ transform: "rotate(180deg)" }} />
        Voltar para a trilha
      </Link>

      <article className="content-detail-article">
        <header className="content-detail-header">
          <div className="content-detail-eyebrow-row">
            <span className="content-detail-eyebrow">Conteúdo</span>
            {done && (
              <span className="content-detail-status">
                <Icon name="check" size={14} />
                Concluído
              </span>
            )}
          </div>
          <h1>{topic.title}</h1>
        </header>

        <MarkdownView>{topic.description}</MarkdownView>

        <footer className="content-detail-footer">
          <button
            type="button"
            className={`completion-button ${done ? "completion-button-done" : ""}`}
            onClick={handleCompletionClick}
          >
            <Icon name="check" size={18} />
            {done ? "Concluído — clique pra desmarcar" : "Marcar como concluído"}
          </button>
        </footer>
      </article>

      <QuickNoteOrb />
    </div>
  );
};

export default ContentDetailPage;
