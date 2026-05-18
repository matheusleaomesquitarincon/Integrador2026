import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listNotes } from "../services/studyNoteService";

const TOPIC_LABEL = {
  arrays: "Arrays",
  vetores: "Vetores",
  matrizes: "Matrizes",
  "tabelas-hash": "Tabela Hash",
  poo: "POO",
  springboot: "Spring Boot",
  portugol: "Portugol",
  outros: "Outros",
};

const formatRelative = (iso) => {
  if (!iso) return "—";
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

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    listNotes()
      .then((data) => setNotes(Array.isArray(data) ? data : []))
      .catch((e) => console.error(e));
  }, []);

  const stats = useMemo(() => {
    const topics = new Set();
    notes.forEach((n) => {
      if (n.topic) topics.add(n.topic);
    });
    const latest = notes.reduce((acc, n) => {
      if (!n.createdAt) return acc;
      const t = new Date(n.createdAt).getTime();
      return !acc || t > acc ? t : acc;
    }, null);
    return {
      noteCount: notes.length,
      topicCount: topics.size,
      latestActivity: latest ? new Date(latest).toISOString() : null,
    };
  }, [notes]);

  const topicCounts = useMemo(() => {
    const counts = {};
    notes.forEach((n) => {
      const key = n.topic || "outros";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  if (!user) return null;

  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div>
      <div className="card">
        <h1 className="title">Seu Perfil</h1>
        <p className="subtitle">Dados da conta e resumo das suas atividades.</p>

        <div className="profile-header">
          <span className="profile-avatar">{initial}</span>
          <div className="profile-info">
            <h2>{user.username}</h2>
            <span className="profile-email">{user.email}</span>
            <span className="profile-meta">
              Membro desde {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="title" style={{ fontSize: "1.15rem" }}>
          Estatísticas
        </h2>
        <div className="profile-stats">
          <div className="profile-stat-card">
            <span className="profile-stat-number">{stats.noteCount}</span>
            <span className="profile-stat-label">Anotações</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-number">{stats.topicCount}</span>
            <span className="profile-stat-label">Tópicos estudados</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-number">
              {stats.latestActivity ? formatRelative(stats.latestActivity) : "—"}
            </span>
            <span className="profile-stat-label">Última atividade</span>
          </div>
        </div>
      </div>

      {topicCounts.length > 0 && (
        <div className="card">
          <h2 className="title" style={{ fontSize: "1.15rem" }}>
            Notas por tópico
          </h2>
          <p className="subtitle" style={{ marginBottom: "0.8rem" }}>
            Distribuição das suas anotações entre os tópicos.
          </p>
          <div className="topic-filter">
            {topicCounts.map(([slug, count]) => (
              <span key={slug} className="topic-chip-filter active">
                {TOPIC_LABEL[slug] || slug} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="title" style={{ fontSize: "1.15rem" }}>
          Conta
        </h2>
        <p className="subtitle" style={{ marginBottom: "0.8rem" }}>
          Sair encerra sua sessão neste navegador.
        </p>
        <button
          type="button"
          className="button-secondary"
          onClick={logout}
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
