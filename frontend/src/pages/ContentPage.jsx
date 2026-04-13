import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/api";
const TOPIC_OPTIONS = [
  { value: "arrays", label: "Array" },
  { value: "vetores", label: "Vetores" },
  { value: "matrizes", label: "Matrizes" },
  { value: "tabelas-hash", label: "Tabela Hash" },
  { value: "poo", label: "Programação orientada a objetos" },
  { value: "springboot", label: "Spring Boot" },
  { value: "portugol", label: "Portugol" },
];
const ARRAY_LONG_TEXT = `Arrays em Java são estruturas de dados fundamentais utilizadas para armazenar múltiplos valores de um mesmo tipo em uma única variável. Eles são muito úteis quando se deseja trabalhar com coleções de dados de tamanho fixo, permitindo acesso rápido aos elementos por meio de índices.

Em Java, um array é declarado especificando o tipo dos elementos seguido de colchetes. Após a declaração, é necessário inicializá-lo, definindo seu tamanho. Cada array possui uma quantidade fixa de posições, que não pode ser alterada após sua criação.

Cada posição do array é acessada por meio de um índice, começando sempre do zero. Isso significa que o primeiro elemento está na posição 0, o segundo na posição 1, e assim por diante. É importante ter cuidado ao acessar os índices, pois tentar acessar uma posição inexistente resulta em erro de execução.

Arrays podem armazenar tanto tipos primitivos, como números e caracteres, quanto objetos, como textos ou instâncias de classes. Essa versatilidade permite que sejam utilizados em diferentes contextos dentro de um programa.

Uma característica importante dos arrays em Java é que seu tamanho é fixo após a criação. Caso haja necessidade de trabalhar com uma estrutura que possa crescer ou diminuir dinamicamente, é mais adequado utilizar outras estruturas de dados, como listas.

Para percorrer os elementos de um array, normalmente são utilizadas estruturas de repetição, permitindo acessar cada posição e manipular seus valores conforme necessário. Além disso, arrays possuem uma propriedade que indica sua quantidade de elementos, facilitando o controle durante a navegação pelos dados.

Também existem arrays multidimensionais, como matrizes, que permitem organizar dados em múltiplas dimensões, como linhas e colunas. Esse tipo de estrutura é bastante utilizado em situações que exigem organização mais complexa dos dados.`;
const VECTOR_LONG_TEXT = `Em Java, o termo "vetor" é frequentemente utilizado como sinônimo de array, especialmente no contexto acadêmico e introdutório à programação. Assim como os arrays, os vetores são estruturas de dados que permitem armazenar múltiplos valores de um mesmo tipo em uma única variável, organizados de forma sequencial na memória.

No entanto, além desse uso conceitual, Java também possui uma classe chamada Vector, que faz parte do pacote padrão da linguagem. Diferente dos arrays, essa classe representa uma estrutura de dados dinâmica, ou seja, seu tamanho pode crescer ou diminuir conforme a necessidade durante a execução do programa.

Uma das principais características do Vector é que ele é sincronizado por padrão, o que significa que é seguro para uso em ambientes com múltiplas threads. Por outro lado, essa sincronização pode gerar uma pequena perda de desempenho em comparação com outras estruturas não sincronizadas.

O Vector permite armazenar objetos e oferece diversos métodos prontos para manipulação de dados, como inserção, remoção, busca e acesso aos elementos. Sua utilização é semelhante a outras coleções dinâmicas, sendo uma alternativa mais antiga dentro do ecossistema Java.

Apesar de ainda estar disponível, o uso de Vector não é tão comum em aplicações modernas. Em muitos casos, desenvolvedores preferem estruturas mais recentes e eficientes, como listas dinâmicas, que oferecem melhor desempenho em cenários onde a sincronização não é necessária.

Em resumo, "vetor" em Java pode se referir tanto ao conceito de array quanto à classe Vector. Enquanto o array possui tamanho fixo e acesso direto aos elementos, o Vector oferece flexibilidade de tamanho e recursos adicionais, sendo mais adequado para situações específicas, especialmente quando há necessidade de controle de concorrência.`;
const MATRIX_LONG_TEXT = `Matrizes em Java são estruturas de dados que permitem armazenar valores em múltiplas dimensões, sendo mais comum o uso em duas dimensões, formando uma espécie de tabela com linhas e colunas. Na prática, uma matriz é um array de arrays, ou seja, cada posição do array principal contém outro array.

Essa estrutura é muito utilizada quando há necessidade de organizar dados de forma mais complexa, como em tabelas, grades, jogos, sistemas de coordenadas ou representações matemáticas. Cada elemento de uma matriz é acessado por dois índices: um para a linha e outro para a coluna, ambos iniciando em zero.

Assim como os arrays, as matrizes em Java possuem tamanho fixo após sua criação. É necessário definir previamente a quantidade de linhas e colunas, e esse tamanho não pode ser alterado durante a execução do programa. Os elementos armazenados devem ser do mesmo tipo, podendo ser tanto tipos primitivos quanto objetos.

Uma característica importante das matrizes em Java é que elas não precisam ser necessariamente regulares. Isso significa que é possível criar estruturas onde cada linha possui tamanhos diferentes, conhecidas como matrizes irregulares ou "jagged arrays". Essa flexibilidade pode ser útil em situações específicas onde os dados não seguem um formato uniforme.

Para trabalhar com matrizes, normalmente utilizam-se estruturas de repetição aninhadas, permitindo percorrer linha por linha e coluna por coluna. Além disso, cada matriz possui propriedades que indicam seu tamanho, facilitando o controle e evitando acessos inválidos.

Em resumo, matrizes são uma extensão dos arrays que permitem organizar dados em múltiplas dimensões. Elas oferecem uma forma eficiente de representar estruturas mais complexas, mantendo a simplicidade e o desempenho característicos dos arrays, sendo amplamente utilizadas em diversas áreas da programação.`;
const HASH_TABLE_LONG_TEXT = `Em Java, tabelas hash são estruturas de dados utilizadas para armazenar e recuperar informações de forma eficiente, com base em uma chave associada a um valor. Elas são amplamente usadas quando se deseja realizar buscas rápidas, inserções e remoções com bom desempenho, geralmente em tempo constante.

O funcionamento de uma tabela hash baseia-se em uma função chamada "função hash", que transforma a chave em um índice numérico. Esse índice indica a posição onde o valor correspondente será armazenado na estrutura. Dessa forma, ao invés de percorrer todos os elementos, o acesso é feito diretamente, tornando as operações mais rápidas.

Uma das implementações mais conhecidas em Java é a classe HashMap, que permite armazenar pares de chave e valor. Nela, cada chave é única, e cada uma está associada a um valor específico. Caso uma chave já existente seja inserida novamente, o valor anterior é substituído.

Um ponto importante no uso de tabelas hash é o tratamento de colisões, que ocorre quando duas chaves diferentes geram o mesmo índice. Para resolver isso, o Java utiliza técnicas internas, como listas encadeadas ou estruturas mais eficientes, garantindo que todos os elementos sejam armazenados corretamente mesmo em casos de conflito.

As tabelas hash em Java não mantêm a ordem dos elementos inseridos, ou seja, os dados não são organizados de forma sequencial. Isso acontece porque a posição de cada elemento depende do resultado da função hash. Caso seja necessário manter uma ordem específica, existem outras variações que oferecem esse comportamento.

Outra característica importante é que o desempenho de uma tabela hash está diretamente ligado à qualidade da função hash e ao dimensionamento da estrutura. Um bom balanceamento evita muitas colisões e garante maior eficiência.

Em resumo, tabelas hash são estruturas extremamente eficientes para armazenamento e busca de dados baseados em chave. Elas são amplamente utilizadas em aplicações que exigem rapidez e desempenho, sendo uma das principais ferramentas dentro do desenvolvimento em Java.`;
const OOP_LONG_TEXT = `A Programação Orientada a Objetos (POO) em Java é um paradigma de programação baseado na organização do código em objetos, que representam entidades do mundo real. Esses objetos são criados a partir de classes, que funcionam como moldes definindo características (atributos) e comportamentos (métodos).

Um dos principais conceitos da POO é o encapsulamento, que consiste em proteger os dados de um objeto, permitindo que eles sejam acessados ou modificados apenas por meio de métodos específicos. Isso aumenta a segurança e a organização do código, evitando alterações indevidas.

Outro conceito fundamental é a herança, que permite que uma classe herde características e comportamentos de outra. Isso promove o reaproveitamento de código e facilita a manutenção, já que funcionalidades comuns podem ser definidas em uma classe base e reutilizadas por outras.

O polimorfismo também é um pilar importante da POO. Ele permite que um mesmo método tenha diferentes comportamentos, dependendo do contexto em que é utilizado. Isso torna o código mais flexível e adaptável, possibilitando a criação de soluções mais genéricas.

Além disso, há o conceito de abstração, que consiste em representar apenas as características essenciais de um objeto, ignorando detalhes desnecessários. Isso ajuda a simplificar o desenvolvimento e focar no que realmente importa para o sistema.

Em Java, a POO é amplamente utilizada e incentivada, sendo a base para o desenvolvimento de aplicações modernas. A linguagem foi projetada com foco nesse paradigma, oferecendo recursos que facilitam a criação de sistemas organizados, reutilizáveis e de fácil manutenção.

Em resumo, a Programação Orientada a Objetos permite estruturar melhor o código, tornando-o mais claro, modular e escalável. Ao utilizar seus principais conceitos, é possível desenvolver sistemas mais robustos e alinhados com boas práticas de desenvolvimento.`;
const SPRING_BOOT_LONG_TEXT = `O Spring Boot é um framework do ecossistema Java que facilita o desenvolvimento de aplicações, principalmente aplicações web e APIs. Ele faz parte do conjunto de projetos do Spring Framework e tem como principal objetivo simplificar a configuração e inicialização de projetos.

Uma das maiores vantagens do Spring Boot é a sua capacidade de configuração automática. Isso significa que ele reduz a necessidade de configurações manuais extensas, permitindo que o desenvolvedor comece rapidamente com um projeto funcional. Ele utiliza convenções inteligentes para definir padrões, diminuindo a quantidade de código e arquivos de configuração.

O Spring Boot também possui um servidor embutido, como o Apache Tomcat, o que elimina a necessidade de instalar e configurar servidores externos. Com isso, a aplicação pode ser executada de forma independente, facilitando testes e deploy.

Outro ponto importante é a integração com diversos módulos do Spring, como segurança, acesso a dados e mensageria. Isso permite criar aplicações completas e robustas, com suporte a banco de dados, autenticação, APIs REST e muito mais.

Além disso, o Spring Boot utiliza o conceito de "starter dependencies", que são conjuntos de dependências prontas para uso. Isso facilita a inclusão de funcionalidades no projeto, evitando conflitos e simplificando o gerenciamento de bibliotecas.

O framework também oferece ferramentas de monitoramento e gerenciamento, permitindo acompanhar o funcionamento da aplicação em tempo real. Esses recursos são úteis para identificar problemas, analisar desempenho e manter a aplicação estável.`;
const PORTUGOL_LONG_TEXT = `Portugol é uma forma de pseudocódigo utilizada para ensinar lógica de programação de maneira simples e acessível, especialmente para iniciantes. Ele utiliza uma linguagem próxima do português, facilitando a compreensão dos conceitos básicos antes de partir para linguagens de programação reais, como Java, Python ou C.

O principal objetivo do Portugol é permitir que o estudante foque na lógica do problema, sem se preocupar inicialmente com regras rígidas de sintaxe. Com ele, é possível representar algoritmos de forma clara, utilizando comandos que se assemelham à linguagem natural, como estruturas condicionais, repetições e operações matemáticas.

Entre os conceitos fundamentais abordados no Portugol estão variáveis, tipos de dados, operadores, estruturas de decisão (como "se" e "senão") e estruturas de repetição (como "enquanto" e "para"). Esses elementos são essenciais para a construção de qualquer algoritmo.

Outra característica importante do Portugol é sua utilização em ferramentas educacionais que permitem executar os algoritmos escritos, ajudando no aprendizado prático. Um exemplo bastante conhecido é o Visualg, que simula a execução dos programas e mostra passo a passo o funcionamento do algoritmo.

O uso do Portugol é muito comum em cursos introdutórios de programação, pois ajuda a desenvolver o raciocínio lógico de forma gradual. Após dominar esses conceitos, o estudante consegue fazer a transição para linguagens mais complexas com maior facilidade.`;

const ContentPage = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0].value);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/contents`);
        const data = await res.json();
        setTopics(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const visibleTopics = topics.filter((topic) => {
    if (topic.slug) {
      return topic.slug === selectedTopic;
    }

    const selected = TOPIC_OPTIONS.find((item) => item.value === selectedTopic);
    return selected ? topic.title?.toLowerCase().includes(selected.label.toLowerCase()) : false;
  });

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
          <div key={t.id} className="note-item">
            <div className="note-title">{t.title}</div>
            {(
              t.slug === "arrays"
                ? ARRAY_LONG_TEXT
                : t.slug === "vetores"
                  ? VECTOR_LONG_TEXT
                  : t.slug === "matrizes"
                    ? MATRIX_LONG_TEXT
                    : t.slug === "tabelas-hash"
                      ? HASH_TABLE_LONG_TEXT
                      : t.slug === "poo"
                        ? OOP_LONG_TEXT
                        : t.slug === "springboot"
                          ? SPRING_BOOT_LONG_TEXT
                          : t.slug === "portugol"
                            ? PORTUGOL_LONG_TEXT
                  : t.description
            )
              .split("\n\n")
              .map((paragraph) => (
                <p key={paragraph} className="note-text">
                  {paragraph}
                </p>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPage;

