import { Fragment, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { listContents } from "../services/contentService";
import Icon from "../components/Icon";

const TOPIC_DEFINITIONS = {
  // Fundamentos
  "variaveis-tipos": { title: "Variáveis e Tipos", hint: "Base do código" },
  "condicionais": { title: "Estruturas Condicionais", hint: "if, else, switch" },
  "repeticao": { title: "Estruturas de Repetição", hint: "for, while" },
  "funcoes": { title: "Funções", hint: "Reuso de código" },
  portugol: { title: "Portugol", hint: "Lógica em pt-BR" },

  // Java
  "sintaxe-java": { title: "Sintaxe Java", hint: "Hello World e tipos" },
  arrays: { title: "Arrays", hint: "Estrutura básica" },
  vetores: { title: "Vetores", hint: "Unidimensional" },
  matrizes: { title: "Matrizes", hint: "Bidimensional" },
  "tabelas-hash": { title: "Tabela Hash", hint: "Acesso por chave" },
  poo: { title: "POO", hint: "Abstração e classes" },
  springboot: { title: "Spring Boot", hint: "Framework para APIs" },

  // Web
  "html-basico": { title: "HTML Básico", hint: "Tags e semântica" },
  "css-basico": { title: "CSS Básico", hint: "Cores, fontes, espaçamento" },
  "css-layout": { title: "CSS Layout", hint: "Flexbox e Grid" },
  "js-basico": { title: "JavaScript Básico", hint: "Variáveis, funções" },
  dom: { title: "DOM", hint: "Manipulação de elementos" },
  "fetch-async": { title: "Fetch e Async", hint: "Requisições HTTP" },
  "frameworks-js": { title: "Frameworks JS", hint: "React, Vue, etc." },

  // Python
  "python-sintaxe": { title: "Sintaxe Python", hint: "print, variáveis, tipos" },
  "python-tipos": { title: "Tipos de Dados", hint: "int, float, str, bool" },
  "python-colecoes": { title: "Coleções", hint: "list, dict, tuple, set" },
  "python-condicionais": { title: "Condicionais", hint: "if, elif, else" },
  "python-loops": { title: "Loops", hint: "for, while, range" },
  "python-funcoes": { title: "Funções", hint: "def, args, kwargs" },
  "python-poo": { title: "POO em Python", hint: "class, self, herança" },
  "python-pandas": { title: "Pandas / NumPy", hint: "Análise de dados" },
  "python-fastapi": { title: "FastAPI / Flask", hint: "APIs web em Python" },

  // Infraestrutura
  "infra-linux": { title: "Linux Básico", hint: "Terminal, permissões" },
  "infra-tcp-ip": { title: "TCP/IP", hint: "Como pacotes viajam" },
  "infra-dns-http": { title: "DNS e HTTP", hint: "Resolução e protocolo web" },
  "infra-web-server": { title: "Web Servers", hint: "Nginx, Apache" },
  "infra-ssh-deploy": { title: "SSH e Deploy", hint: "Acesso remoto" },
  "infra-docker": { title: "Docker", hint: "Containers e imagens" },
  "infra-cloud": { title: "Cloud Computing", hint: "AWS, GCP, Azure" },
  "infra-cicd": { title: "CI/CD", hint: "Pipelines automatizados" },
  "infra-monitoring": { title: "Monitoramento", hint: "Logs e métricas" },

  // SQL
  "sql-relacional": { title: "Modelo Relacional", hint: "Tabelas, chaves, relações" },
  "sql-select": { title: "SELECT", hint: "Buscar dados" },
  "sql-where": { title: "WHERE / ORDER BY", hint: "Filtros e ordenação" },
  "sql-cud": { title: "INSERT, UPDATE, DELETE", hint: "Modificar dados" },
  "sql-joins": { title: "JOINs", hint: "INNER, LEFT, RIGHT" },
  "sql-group-by": { title: "GROUP BY", hint: "Agregações e HAVING" },
  "sql-subqueries": { title: "Subqueries", hint: "Consultas aninhadas" },
  "sql-indices": { title: "Índices", hint: "Acelerar buscas" },
  "sql-normalizacao": { title: "Normalização", hint: "Modelar bancos" },
  "sql-transacoes": { title: "Transações", hint: "ACID e isolamento" },
};

const ROADMAPS = [
  {
    id: "fundamentos",
    title: "Fundamentos & Lógica",
    description:
      "Lógica de programação aplicada com Portugol. Ideal para quem está começando.",
    icon: "lightbulb",
    blocks: [
      {
        label: "Conceitos Básicos",
        rows: [["variaveis-tipos"], ["condicionais"], ["repeticao"]],
      },
      {
        label: "Modularização",
        rows: [["funcoes"]],
      },
      {
        label: "Prática",
        rows: [["portugol"]],
      },
    ],
  },
  {
    id: "java",
    title: "Java",
    description:
      "Da sintaxe básica até desenvolvimento de APIs REST com Spring Boot.",
    icon: "layers",
    blocks: [
      {
        label: "Início",
        rows: [["sintaxe-java"]],
      },
      {
        label: "Estruturas de Dados",
        rows: [["arrays", "vetores", "matrizes"], ["tabelas-hash"]],
      },
      {
        label: "Paradigma",
        rows: [["poo"]],
      },
      {
        label: "Framework",
        rows: [["springboot"]],
      },
    ],
  },
  {
    id: "web",
    title: "HTML + CSS + JavaScript",
    description:
      "Desenvolvimento web frontend, do HTML estático aos frameworks modernos.",
    icon: "code",
    blocks: [
      {
        label: "Estrutura",
        rows: [["html-basico"]],
      },
      {
        label: "Estilo",
        rows: [["css-basico"], ["css-layout"]],
      },
      {
        label: "Interatividade",
        rows: [["js-basico"], ["dom"]],
      },
      {
        label: "Avançado",
        rows: [["fetch-async"], ["frameworks-js"]],
      },
    ],
  },
  {
    id: "python",
    title: "Python",
    description:
      "Linguagem versátil para automação, análise de dados, web e IA. Curva de aprendizado suave.",
    icon: "terminal",
    blocks: [
      {
        label: "Início",
        rows: [["python-sintaxe"]],
      },
      {
        label: "Tipos e Estruturas",
        rows: [["python-tipos"], ["python-colecoes"]],
      },
      {
        label: "Controle de Fluxo",
        rows: [["python-condicionais", "python-loops"]],
      },
      {
        label: "Funções e POO",
        rows: [["python-funcoes"], ["python-poo"]],
      },
      {
        label: "Aplicações",
        rows: [["python-pandas", "python-fastapi"]],
      },
    ],
  },
  {
    id: "infra",
    title: "Infraestrutura",
    description:
      "Como aplicações rodam em produção: servidores, redes, containers e deploy.",
    icon: "server",
    blocks: [
      {
        label: "Sistema",
        rows: [["infra-linux"]],
      },
      {
        label: "Redes",
        rows: [["infra-tcp-ip"], ["infra-dns-http"]],
      },
      {
        label: "Servidores",
        rows: [["infra-web-server"], ["infra-ssh-deploy"]],
      },
      {
        label: "Containers",
        rows: [["infra-docker"]],
      },
      {
        label: "Cloud & DevOps",
        rows: [["infra-cloud"], ["infra-cicd"], ["infra-monitoring"]],
      },
    ],
  },
  {
    id: "sql",
    title: "SQL & Bancos de Dados",
    description:
      "Linguagem para consultar e modelar bancos relacionais. Essencial pra qualquer backend.",
    icon: "database",
    blocks: [
      {
        label: "Conceitos",
        rows: [["sql-relacional"]],
      },
      {
        label: "Consultas Básicas",
        rows: [["sql-select", "sql-where"]],
      },
      {
        label: "Modificações",
        rows: [["sql-cud"]],
      },
      {
        label: "Combinando Tabelas",
        rows: [["sql-joins"]],
      },
      {
        label: "Agregações",
        rows: [["sql-group-by"], ["sql-subqueries"]],
      },
      {
        label: "Performance e Modelagem",
        rows: [["sql-indices"], ["sql-normalizacao"], ["sql-transacoes"]],
      },
    ],
  },
];

const countTopics = (roadmap) =>
  roadmap.blocks.reduce(
    (acc, b) => acc + b.rows.reduce((s, r) => s + r.length, 0),
    0
  );

const findRoadmapForSlug = (slug) =>
  ROADMAPS.find((rm) =>
    rm.blocks.some((b) => b.rows.some((r) => r.includes(slug)))
  );

const ContentPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [modalTopic, setModalTopic] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

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

  // Deep-link: ?topic=slug auto-seleciona o roadmap correto e abre o modal
  useEffect(() => {
    const slug = searchParams.get("topic");
    if (slug && topicBySlug[slug] && !modalTopic) {
      const rm = findRoadmapForSlug(slug);
      if (rm) setSelectedRoadmapId(rm.id);
      setModalTopic(topicBySlug[slug]);
    }
  }, [searchParams, topicBySlug, modalTopic]);

  const selectedRoadmap = ROADMAPS.find((r) => r.id === selectedRoadmapId);

  const openTopicModal = (slug) => {
    const topic = topicBySlug[slug];
    if (topic) setModalTopic(topic);
  };

  const closeModal = () => {
    setModalTopic(null);
    if (searchParams.has("topic")) {
      searchParams.delete("topic");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const backToTrails = () => {
    setSelectedRoadmapId(null);
    if (searchParams.has("topic")) {
      searchParams.delete("topic");
      setSearchParams(searchParams, { replace: true });
    }
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
                              return (
                                <button
                                  key={slug}
                                  type="button"
                                  className="roadmap-node"
                                  onClick={() => openTopicModal(slug)}
                                  disabled={!backendTopic}
                                  title={
                                    backendTopic
                                      ? def.hint || "Abrir conteúdo"
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

      {modalTopic && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "720px" }}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Fechar"
            >
              <Icon name="close" size={18} />
            </button>
            <h2 className="title">{modalTopic.title}</h2>
            {modalTopic.description.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="note-text"
                style={{ marginBottom: "1rem", lineHeight: "1.6" }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage;
