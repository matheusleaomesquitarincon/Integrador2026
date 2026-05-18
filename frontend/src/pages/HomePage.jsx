import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { listNotes } from "../services/studyNoteService";
import { listContents } from "../services/contentService";
import { useAuth } from "../contexts/AuthContext";
import { ROADMAPS, countTopics, getAllSlugs } from "../data/roadmaps";

const HERO_KEY = "quizbyte-hero-dismissed";

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

const STEPS = [
  {
    number: "01",
    icon: "book",
    title: "Estude o conteúdo",
    description:
      "Comece pela aba Conteúdos. Cada tópico de Java é explicado de forma direta, sem rodeios — você pode ler na ordem que faz sentido pra você e voltar quando precisar.",
  },
  {
    number: "02",
    icon: "edit",
    title: "Anote ativamente",
    description:
      "Reescreva o que entendeu no Bloco de Notas. Aceita Markdown completo: títulos, listas, links, tabelas e blocos de código Java com destaque de sintaxe.",
  },
  {
    number: "03",
    icon: "check",
    title: "Pratique no quiz",
    description:
      "Filtre o quiz pelo tópico que acabou de estudar e responda. Errar faz parte — cada erro mostra exatamente o que precisa reler nas suas anotações.",
  },
];

const FEATURES = [
  {
    icon: "layers",
    title: "Organização por tópico",
    description:
      "Conteúdos, anotações e quiz compartilham os mesmos sete assuntos de Java. Filtrar em qualquer aba sempre dá resultado coerente.",
  },
  {
    icon: "code",
    title: "Markdown e código",
    description:
      "Suas notas suportam negrito, listas, links, citações, tabelas e blocos de código com syntax highlight (basta usar três crases e o nome da linguagem).",
  },
  {
    icon: "search",
    title: "Busca instantânea",
    description:
      "Encontre uma anotação por título ou conteúdo em tempo real. Combine com filtros de tópico e ordenação para varrer dezenas de notas em segundos.",
  },
];

const TIPS = [
  {
    title: "Sintetize com suas palavras",
    description:
      "Copiar e colar o conteúdo não fixa nada. Reescrever cada conceito com seu próprio vocabulário ativa a memória de longo prazo.",
  },
  {
    title: "Releia antes do quiz",
    description:
      "Olhar suas notas do tópico imediatamente antes de responder consolida o conhecimento muito mais do que ler uma única vez.",
  },
  {
    title: "Cole código nas anotações",
    description:
      "Use ```java em volta de exemplos para ter o destaque de sintaxe. Ler código formatado é parte essencial de aprender a programar.",
  },
  {
    title: "Volte ao básico de vez em quando",
    description:
      "Revisitar arrays e POO mesmo quando você já está em Spring Boot ajuda a perceber lacunas que passaram batidas na primeira leitura.",
  },
];

const ACTIONS_FINAL = [
  { to: "/conteudos", label: "Ir para Conteúdos" },
  { to: "/estudo", label: "Abrir Bloco de Notas" },
  { to: "/quiz", label: "Fazer um quiz" },
];

const HomePage = () => {
  const [heroDismissed, setHeroDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(HERO_KEY) === "1";
  });
  const [notes, setNotes] = useState([]);
  const [topics, setTopics] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    listContents()
      .then((data) => setTopics(Array.isArray(data) ? data : []))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }
    listNotes()
      .then((data) => setNotes(Array.isArray(data) ? data : []))
      .catch((e) => console.error(e));
  }, [user]);

  const recentNotes = useMemo(
    () =>
      [...notes]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 3),
    [notes]
  );

  const availableRoadmaps = useMemo(() => {
    const slugSet = new Set(topics.map((t) => t.slug));
    return ROADMAPS.filter((rm) =>
      getAllSlugs(rm).some((s) => slugSet.has(s))
    );
  }, [topics]);

  const dismissHero = () => {
    setHeroDismissed(true);
    try {
      localStorage.setItem(HERO_KEY, "1");
    } catch (e) {
      // localStorage indisponível
    }
  };

  const reopenHero = () => {
    setHeroDismissed(false);
    try {
      localStorage.removeItem(HERO_KEY);
    } catch (e) {
      // localStorage indisponível
    }
  };

  return (
    <div className="home-stack">
      {!heroDismissed && (
        <section className="hero-card">
          <button
            type="button"
            className="hero-dismiss"
            onClick={dismissHero}
            aria-label="Dispensar introdução"
            title="Dispensar"
          >
            <Icon name="close" size={16} />
          </button>
          <div className="hero-eyebrow">Comece por aqui</div>
          <h1>Estude Java do básico ao avançado</h1>
          <p>
            QuizByte é uma plataforma de estudo dividida em três áreas que trabalham
            juntas: conteúdo teórico por tópico, anotações em Markdown vinculadas à
            sua conta e quiz por assunto. Sem distração, sem propaganda — só as
            ferramentas que você precisa pra fixar o que aprendeu.
          </p>
          <Link to="/conteudos" className="button-primary">
            Explorar conteúdos
          </Link>
        </section>
      )}

      <section className="home-section">
        <div className="section-heading">
          <h2>Como funciona</h2>
        </div>
        <p className="section-description">
          Três etapas que se reforçam. Repita o ciclo pra cada tópico e você cobre
          a matéria inteira em poucas sessões.
        </p>
        <div className="steps-grid">
          {STEPS.map((step) => (
            <article key={step.number} className="step-card">
              <span className="step-number">Passo {step.number}</span>
              <span className="step-icon">
                <Icon name={step.icon} size={22} />
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {availableRoadmaps.length > 0 && (
        <section className="home-section">
          <div className="section-heading">
            <h2>Trilhas disponíveis</h2>
            <Link to="/conteudos" className="section-link">
              Ver todas
              <Icon name="chevronRight" size={14} />
            </Link>
          </div>
          <p className="section-description">
            Cada trilha é um caminho independente, com tópicos em ordem
            recomendada. Escolha por onde começar.
          </p>
          <div className="topics-grid">
            {availableRoadmaps.map((rm) => (
              <Link
                key={rm.id}
                to="/conteudos"
                className="topic-card"
              >
                <h3>{rm.title}</h3>
                <p>{rm.description}</p>
                <span className="topic-card-cta">
                  {countTopics(rm)} tópicos
                  <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="section-heading">
          <h2>O que você ganha</h2>
        </div>
        <p className="section-description">
          As ferramentas foram desenhadas pra trabalharem juntas. Quatro coisas que
          a maioria das plataformas não oferece.
        </p>
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="feature-row">
              <span className="feature-icon">
                <Icon name={feature.icon} size={18} />
              </span>
              <div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2>Dicas para estudar melhor</h2>
        </div>
        <p className="section-description">
          Quatro práticas que funcionam pra qualquer linguagem, mas se encaixam
          bem com o fluxo do QuizByte.
        </p>
        <div className="tips-list">
          {TIPS.map((tip) => (
            <div key={tip.title} className="tip-item">
              <span className="tip-icon">
                <Icon name="lightbulb" size={18} />
              </span>
              <div>
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {recentNotes.length > 0 && (
        <section className="home-section">
          <div className="section-heading">
            <h2>Suas anotações recentes</h2>
            <Link to="/estudo" className="section-link">
              Ver todas
              <Icon name="chevronRight" size={14} />
            </Link>
          </div>
          <div className="recent-list">
            {recentNotes.map((note) => (
              <Link key={note.id} to="/estudo" className="recent-item">
                <div className="recent-item-main">
                  <span className="topic-chip">
                    {TOPIC_LABEL[note.topic] || "Outros"}
                  </span>
                  <span className="recent-item-title">{note.title}</span>
                </div>
                <span className="recent-item-meta">
                  {formatRelative(note.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="cta-final">
        <h2>Pronto para começar?</h2>
        <p>Escolha por onde entrar. Você pode trocar de aba a qualquer momento.</p>
        <div className="cta-final-actions">
          <Link to={ACTIONS_FINAL[0].to} className="button-primary">
            {ACTIONS_FINAL[0].label}
          </Link>
          <Link to={ACTIONS_FINAL[1].to} className="button-secondary">
            {ACTIONS_FINAL[1].label}
          </Link>
          <Link to={ACTIONS_FINAL[2].to} className="button-secondary">
            {ACTIONS_FINAL[2].label}
          </Link>
        </div>
      </section>

      {heroDismissed && (
        <div className="home-footer-link">
          <button type="button" onClick={reopenHero}>
            Reexibir introdução
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
