export const TOPIC_DEFINITIONS = {
  // Fundamentos
  algoritmos: { title: "Algoritmos e Pseudocódigo", hint: "Pensar em passos" },
  "variaveis-tipos": { title: "Variáveis e Tipos", hint: "Base do código" },
  operadores: { title: "Operadores", hint: "Aritméticos e relacionais" },
  strings: { title: "Manipulação de Strings", hint: "Texto e métodos" },
  "entrada-saida": { title: "Entrada e Saída", hint: "Scanner e println" },
  condicionais: { title: "Estruturas Condicionais", hint: "if, else, switch" },
  repeticao: { title: "Estruturas de Repetição", hint: "for, while" },
  funcoes: { title: "Funções", hint: "Reuso de código" },
  escopo: { title: "Escopo de Variáveis", hint: "Onde uma variável vive" },
  recursao: { title: "Recursão", hint: "Função que chama a si mesma" },
  decomposicao: { title: "Decomposição de Problemas", hint: "Quebrar em partes" },

  // Java
  "ambiente-java": { title: "Configurando o Ambiente", hint: "JDK, IDE, primeiro projeto" },
  "jvm-compilacao": { title: "Compilação e JVM", hint: "javac, bytecode, multiplataforma" },
  "sintaxe-java": { title: "Sintaxe Java", hint: "Hello World e estrutura" },
  "primitivos-wrapper": { title: "Primitivos vs Wrapper", hint: "int vs Integer, autoboxing" },
  "pacotes-imports": { title: "Pacotes e Imports", hint: "Organização de arquivos" },
  javadoc: { title: "Documentação Javadoc", hint: "Comentários estruturados" },
  arrays: { title: "Arrays", hint: "Estrutura básica" },
  vetores: { title: "Vetores", hint: "Unidimensional" },
  matrizes: { title: "Matrizes", hint: "Bidimensional" },
  listas: { title: "Listas Dinâmicas", hint: "ArrayList e LinkedList" },
  sets: { title: "Sets", hint: "HashSet, TreeSet, sem duplicados" },
  "tabelas-hash": { title: "Tabela Hash", hint: "HashMap, TreeMap" },
  "pilhas-filas": { title: "Pilhas e Filas", hint: "Stack, Queue, Deque" },
  iteradores: { title: "Iteradores", hint: "Iterator e Iterable" },
  comparator: { title: "Comparator e Comparable", hint: "Ordenação customizada" },
  imutaveis: { title: "Coleções Imutáveis", hint: "List.of, unmodifiable" },
  streams: { title: "Stream API", hint: "filter, map, collect" },
  encapsulamento: { title: "Encapsulamento", hint: "Ocultar estado interno" },
  heranca: { title: "Herança", hint: "extends, super, hierarquia" },
  polimorfismo: { title: "Polimorfismo", hint: "Overriding e late binding" },
  abstracao: { title: "Abstração", hint: "Classes abstratas e interfaces" },
  "spring-intro": { title: "Introdução ao Spring Boot", hint: "Initializr, primeiro projeto" },
  "spring-di": { title: "Injeção de Dependências", hint: "IoC, @Component, @Autowired" },
  "spring-config": { title: "Properties e Configuração", hint: "application.yml, profiles" },
  "spring-beans": { title: "Beans e Ciclo de Vida", hint: "@Bean, @Configuration, escopos" },
  "spring-rest": { title: "REST APIs", hint: "@RestController, mappings" },
  "spring-validation": { title: "Validação de Dados", hint: "@Valid, Bean Validation" },
  "spring-exceptions": { title: "Tratamento de Exceções", hint: "@ControllerAdvice" },
  "spring-security": { title: "Spring Security", hint: "Autenticação e autorização" },
  "spring-jpa-entities": { title: "Entidades JPA", hint: "@Entity, relacionamentos" },
  "spring-data-jpa": { title: "Spring Data JPA", hint: "JpaRepository, queries" },

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

export const ROADMAPS = [
  {
    id: "fundamentos",
    title: "Fundamentos & Lógica",
    description:
      "Lógica de programação aplicada com Portugol. Ideal para quem está começando.",
    icon: "lightbulb",
    blocks: [
      {
        label: "Conceitos Básicos",
        rows: [
          ["algoritmos"],
          ["variaveis-tipos"],
          ["operadores"],
          ["strings"],
          ["entrada-saida"],
          ["condicionais"],
          ["repeticao"],
        ],
      },
      {
        label: "Modularização",
        rows: [
          ["funcoes"],
          ["escopo"],
          ["recursao"],
          ["decomposicao"],
        ],
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
        rows: [
          ["ambiente-java"],
          ["jvm-compilacao"],
          ["sintaxe-java"],
          ["primitivos-wrapper"],
          ["pacotes-imports"],
          ["javadoc"],
        ],
      },
      {
        label: "Estruturas de Dados",
        rows: [
          ["arrays"],
          ["vetores"],
          ["matrizes"],
          ["listas"],
          ["sets"],
          ["tabelas-hash"],
          ["pilhas-filas"],
          ["iteradores"],
          ["comparator"],
          ["imutaveis"],
          ["streams"],
        ],
      },
      {
        label: "Paradigma",
        rows: [
          ["encapsulamento"],
          ["heranca"],
          ["polimorfismo"],
          ["abstracao"],
        ],
      },
      {
        label: "Framework",
        rows: [
          ["spring-intro"],
          ["spring-di"],
          ["spring-config"],
          ["spring-beans"],
          ["spring-rest"],
          ["spring-validation"],
          ["spring-exceptions"],
          ["spring-security"],
          ["spring-jpa-entities"],
          ["spring-data-jpa"],
        ],
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
      { label: "Estrutura", rows: [["html-basico"]] },
      { label: "Estilo", rows: [["css-basico"], ["css-layout"]] },
      { label: "Interatividade", rows: [["js-basico"], ["dom"]] },
      { label: "Avançado", rows: [["fetch-async"], ["frameworks-js"]] },
    ],
  },
  {
    id: "python",
    title: "Python",
    description:
      "Linguagem versátil para automação, análise de dados, web e IA. Curva de aprendizado suave.",
    icon: "terminal",
    blocks: [
      { label: "Início", rows: [["python-sintaxe"]] },
      { label: "Tipos e Estruturas", rows: [["python-tipos"], ["python-colecoes"]] },
      { label: "Controle de Fluxo", rows: [["python-condicionais", "python-loops"]] },
      { label: "Funções e POO", rows: [["python-funcoes"], ["python-poo"]] },
      { label: "Aplicações", rows: [["python-pandas", "python-fastapi"]] },
    ],
  },
  {
    id: "infra",
    title: "Infraestrutura",
    description:
      "Como aplicações rodam em produção: servidores, redes, containers e deploy.",
    icon: "server",
    blocks: [
      { label: "Sistema", rows: [["infra-linux"]] },
      { label: "Redes", rows: [["infra-tcp-ip"], ["infra-dns-http"]] },
      { label: "Servidores", rows: [["infra-web-server"], ["infra-ssh-deploy"]] },
      { label: "Containers", rows: [["infra-docker"]] },
      { label: "Cloud & DevOps", rows: [["infra-cloud"], ["infra-cicd"], ["infra-monitoring"]] },
    ],
  },
  {
    id: "sql",
    title: "SQL & Bancos de Dados",
    description:
      "Linguagem para consultar e modelar bancos relacionais. Essencial pra qualquer backend.",
    icon: "database",
    blocks: [
      { label: "Conceitos", rows: [["sql-relacional"]] },
      { label: "Consultas Básicas", rows: [["sql-select", "sql-where"]] },
      { label: "Modificações", rows: [["sql-cud"]] },
      { label: "Combinando Tabelas", rows: [["sql-joins"]] },
      { label: "Agregações", rows: [["sql-group-by"], ["sql-subqueries"]] },
      { label: "Performance e Modelagem", rows: [["sql-indices"], ["sql-normalizacao"], ["sql-transacoes"]] },
    ],
  },
];

export const countTopics = (roadmap) =>
  roadmap.blocks.reduce(
    (acc, b) => acc + b.rows.reduce((s, r) => s + r.length, 0),
    0
  );

export const getAllSlugs = (roadmap) =>
  roadmap.blocks.flatMap((b) => b.rows.flatMap((r) => r));

export const findRoadmapById = (id) => ROADMAPS.find((r) => r.id === id);

export const findRoadmapForSlug = (slug) =>
  ROADMAPS.find((rm) =>
    rm.blocks.some((b) => b.rows.some((r) => r.includes(slug)))
  );
