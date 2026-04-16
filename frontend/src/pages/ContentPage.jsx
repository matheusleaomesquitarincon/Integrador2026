import { useState, useEffect } from "react";
// import { apiUrl } from "../config/api"; 

// (Mock limpo e estruturado)
const MOCK_CONTENTS = [
  {
    id: 1,
    slug: "arrays",
    title: "Arrays em Java",
    description: "Arrays em Java são estruturas de dados fundamentais utilizadas para armazenar múltiplos valores de um mesmo tipo em uma única variável. Eles são muito úteis quando se deseja trabalhar com coleções de dados de tamanho fixo, permitindo acesso rápido aos elementos por meio de índices.\n\nEm Java, um array é declarado especificando o tipo dos elementos seguido de colchetes. Após a declaração, é necessário inicializá-lo, definindo seu tamanho. Cada array possui uma quantidade fixa de posições, que não pode ser alterada após sua criação.\n\nPara percorrer os elementos de um array, normalmente são utilizadas estruturas de repetição, permitindo acessar cada posição e manipular seus valores conforme necessário."
  },
  {
    id: 2,
    slug: "vetores",
    title: "Vetores (Vector)",
    description: "Em Java, o termo 'vetor' é frequentemente utilizado como sinônimo de array. No entanto, Java também possui uma classe chamada Vector.\n\nDiferente dos arrays, essa classe representa uma estrutura de dados dinâmica, ou seja, seu tamanho pode crescer ou diminuir conforme a necessidade durante a execução do programa.\n\nUma das principais características do Vector é que ele é sincronizado por padrão, o que significa que é seguro para uso em ambientes com múltiplas threads."
  },
  {
    id: 3,
    slug: "matrizes",
    title: "Matrizes",
    description: "Matrizes em Java são estruturas de dados que permitem armazenar valores em múltiplas dimensões, sendo mais comum o uso em duas dimensões, formando uma espécie de tabela com linhas e colunas.\n\nNa prática, uma matriz é um array de arrays, ou seja, cada posição do array principal contém outro array.\n\nEssa estrutura é muito utilizada quando há necessidade de organizar dados de forma mais complexa, como em tabelas, grades, jogos, sistemas de coordenadas ou representações matemáticas."
  },
  {
    id: 4,
    slug: "tabelas-hash",
    title: "Tabelas Hash",
    description: "Em Java, tabelas hash são estruturas de dados utilizadas para armazenar e recuperar informações de forma eficiente, com base em uma chave associada a um valor.\n\nO funcionamento baseia-se em uma 'função hash', que transforma a chave em um índice numérico. Uma das implementações mais conhecidas em Java é a classe HashMap.\n\nAs tabelas hash não mantêm a ordem dos elementos inseridos, ou seja, os dados não são organizados de forma sequencial."
  },
  {
    id: 5,
    slug: "poo",
    title: "Programação Orientada a Objetos",
    description: "A Programação Orientada a Objetos (POO) em Java é um paradigma baseado na organização do código em objetos, que representam entidades do mundo real.\n\nOs principais pilares são:\n- Encapsulamento: Proteger os dados.\n- Herança: Reaproveitar código criando hierarquias.\n- Polimorfismo: Múltiplos comportamentos para o mesmo método.\n- Abstração: Focar no que é essencial."
  },
  {
    id: 6,
    slug: "springboot",
    title: "Spring Boot",
    description: "O Spring Boot é um framework do ecossistema Java que facilita o desenvolvimento de aplicações, principalmente aplicações web e APIs.\n\nUma das maiores vantagens é a sua capacidade de configuração automática (Auto-configuration). Ele também possui um servidor embutido, como o Apache Tomcat, o que elimina a necessidade de instalar e configurar servidores externos."
  },
  {
    id: 7,
    slug: "portugol",
    title: "Lógica com Portugol",
    description: "Portugol é uma forma de pseudocódigo utilizada para ensinar lógica de programação de maneira simples e acessível.\n\nEle utiliza uma linguagem próxima do português, facilitando a compreensão dos conceitos básicos antes de partir para linguagens de programação reais, como Java. Ferramentas como o Visualg são amplamente utilizadas para executar esses algoritmos."
  }
];

const TOPIC_OPTIONS = [
  { value: "arrays", label: "Array" },
  { value: "vetores", label: "Vetores" },
  { value: "matrizes", label: "Matrizes" },
  { value: "tabelas-hash", label: "Tabela Hash" },
  { value: "poo", label: "Programação orientada a objetos" },
  { value: "springboot", label: "Spring Boot" },
  { value: "portugol", label: "Portugol" },
];

const ContentPage = () => {
  const [topics, setTopics] = useState(MOCK_CONTENTS);
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0].value);

  // Código Backend 
  /*
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(apiUrl("/contents"));
        if (res.ok) {
          const data = await res.json();
          setTopics(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);
  */

  const visibleTopics = topics.filter((topic) => topic.slug === selectedTopic);

  return (
    <div className="card">
      <h1 className="title">Conteúdos de Java</h1>
      <p className="subtitle">
        Explore os principais assuntos para estudar: arrays, vetores, matrizes, tabela
        hash, POO, Spring Boot e Portugol.
      </p>

      <div className="floating-topic-tabs">
        {TOPIC_OPTIONS.map((topicOption) => (
          <button
            key={topicOption.value}
            type="button"
            className={`floating-topic-tab ${
              selectedTopic === topicOption.value ? "active" : ""
            }`}
            onClick={() => setSelectedTopic(topicOption.value)}
          >
            {topicOption.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {visibleTopics.map((t) => (
          <div key={t.id} className="note-item" style={{ marginTop: "2rem" }}>
            <h2 className="note-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t.title}</h2>
            
            {t.description.split("\n\n").map((paragraph, index) => (
              <p key={index} className="note-text" style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}
        
        {visibleTopics.length === 0 && (
          <p className="subtitle" style={{ marginTop: "2rem" }}>
            Conteúdo não encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentPage;