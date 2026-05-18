import { Fragment, useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { listContents } from "../services/contentService";
import Icon from "../components/Icon";
import { useProgress } from "../contexts/ProgressContext";
import {
  TOPIC_DEFINITIONS,
  ROADMAPS,
  countTopics,
  findRoadmapForSlug,
  getAllSlugs,
} from "../data/roadmaps";


const fireConfetti = () => {
  const opts = { startVelocity: 35, ticks: 200, zIndex: 9999 };
  confetti({ ...opts, particleCount: 120, spread: 80, origin: { y: 0.5 } });
  setTimeout(() => {
    confetti({ ...opts, particleCount: 60, angle: 60, spread: 55, origin: { x: 0.1, y: 0.65 } });
    confetti({ ...opts, particleCount: 60, angle: 120, spread: 55, origin: { x: 0.9, y: 0.65 } });
  }, 250);
};

const ContentPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [celebrateSlug, setCelebrateSlug] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isCompleted } = useProgress();

  // Lê state vindo de ContentDetailPage: celebrate (concluiu) ou fromSlug (voltou)
  useEffect(() => {
    const celebrateSlug = location.state?.celebrate;
    const fromSlug = location.state?.fromSlug;
    const slug = celebrateSlug || fromSlug;
    if (!slug) return;

    // Limpa state imediatamente pra não re-disparar em refresh/back
    navigate(location.pathname, { replace: true, state: null });

    // Seleciona a trilha que contém o slug
    const rm = findRoadmapForSlug(slug);
    if (rm) setSelectedRoadmapId(rm.id);

    // Animação + confetes só no caso de celebração
    if (!celebrateSlug) return;

    setCelebrateSlug(celebrateSlug);
    const tConf = setTimeout(fireConfetti, 200);
    const tClass = setTimeout(() => setCelebrateSlug(null), 1800);

    return () => {
      clearTimeout(tConf);
      clearTimeout(tClass);
    };
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    listContents()
      .then((data) => setTopics(Array.isArray(data) ? data : []))
      .catch((e) => console.error(e));
  }, []);

  const topicBySlug = useMemo(() => {
    const map = {};
    topics.forEach((t) => {
      map[t.slug] = t;
    });
    return map;
  }, [topics]);

  const selectedRoadmap = ROADMAPS.find((r) => r.id === selectedRoadmapId);

  const openTopic = (slug) => {
    const topic = topicBySlug[slug];
    if (topic) navigate(`/conteudos/${encodeURIComponent(slug)}`);
  };

  const backToTrails = () => {
    setSelectedRoadmapId(null);
  };

  return (
    <div className="card">
      {!selectedRoadmap ? (
        <>
          <h1 className="title">Trilhas de Estudo</h1>
          <p className="subtitle">
            Escolha uma trilha para começar. Cada uma é um caminho independente,
            com tópicos organizados em ordem recomendada.
          </p>

          <div className="trails-grid">
            {ROADMAPS.map((rm) => (
              <button
                key={rm.id}
                type="button"
                className="trail-card"
                onClick={() => setSelectedRoadmapId(rm.id)}
              >
                <span className="trail-card-icon">
                  <Icon name={rm.icon} size={22} />
                </span>
                <h3>{rm.title}</h3>
                <p>{rm.description}</p>
                <span className="trail-card-meta">
                  {countTopics(rm)} tópicos
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button type="button" className="trail-back" onClick={backToTrails}>
            <Icon name="chevronRight" size={14} style={{ transform: "rotate(180deg)" }} />
            Todas as trilhas
          </button>

          <h1 className="title">{selectedRoadmap.title}</h1>
          <p className="subtitle">{selectedRoadmap.description}</p>

          {(() => {
            const slugs = getAllSlugs(selectedRoadmap);
            const availableSlugs = slugs.filter((s) => topicBySlug[s]);
            const total = availableSlugs.length;
            const completedCount = availableSlugs.filter((s) => isCompleted(s)).length;
            const allDone = total > 0 && completedCount === total;

            if (allDone) {
              return (
                <Link to={`/certificado/${selectedRoadmap.id}`} className="cert-cta">
                  <Icon name="check" size={16} />
                  Trilha concluída — Gerar certificado
                </Link>
              );
            }

            const label =
              total === 0
                ? "Certificado disponível em breve"
                : `Conclua os ${total} tópicos pra liberar o certificado (${completedCount}/${total})`;

            return (
              <div
                className="cert-cta cert-cta-locked"
                aria-disabled="true"
                title={label}
              >
                <Icon name="check" size={16} />
                {label}
              </div>
            );
          })()}

          {(() => {
            let num = 0;
            let singleRowCounter = 0;
            const zigzagCycle = [-55, 0, 55, 0];
            return (
              <div className="roadmap">
                {selectedRoadmap.blocks.map((block) => (
                  <section key={block.label} className="roadmap-block">
                    <span className="roadmap-block-label">{block.label}</span>
                    <div className="roadmap-block-body">
                      {block.rows.map((row, rowIdx) => {
                        const isSingle = row.length === 1;
                        let translate = 0;
                        if (isSingle) {
                          translate = zigzagCycle[singleRowCounter % zigzagCycle.length];
                          singleRowCounter += 1;
                        }
                        return (
                          <div
                            key={rowIdx}
                            className="roadmap-row"
                            style={{ transform: `translateX(${translate}px)` }}
                          >
                            {row.map((slug) => {
                              num += 1;
                              const numStr = String(num).padStart(2, "0");
                              const def = TOPIC_DEFINITIONS[slug] || {
                                title: slug,
                                hint: "",
                              };
                              const backendTopic = topicBySlug[slug];
                              const title = backendTopic?.title || def.title;
                              const done = backendTopic && isCompleted(slug);
                              const celebrating = celebrateSlug === slug;
                              return (
                                <button
                                  key={slug}
                                  type="button"
                                  className={`roadmap-node ${done ? "completed" : ""} ${celebrating ? "celebrating" : ""}`}
                                  onClick={() => openTopic(slug)}
                                  disabled={!backendTopic}
                                  title={
                                    backendTopic
                                      ? done
                                        ? "Concluído — abrir conteúdo"
                                        : def.hint || "Abrir conteúdo"
                                      : "Conteúdo em breve"
                                  }
                                >
                                  <span className="roadmap-node-num">{numStr}</span>
                                  <span className="roadmap-node-title">{title}</span>
                                  {def.hint && (
                                    <span className="roadmap-node-hint">
                                      {def.hint}
                                    </span>
                                  )}
                                  {done && (
                                    <span className="roadmap-node-check" aria-label="Concluído">
                                      <Icon name="check" size={14} />
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            );
          })()}
        </>
      )}

    </div>
  );
};

export default ContentPage;
