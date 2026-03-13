const HomePage = () => {
  return (
    <div className="card">
      <h1 className="title">Bem-vindo ao QuizByte</h1>
      <p className="subtitle">
        Uma plataforma feita para você dominar Java passo a passo, misturando teoria,
        anotações e quizzes interativos.
      </p>

      <div className="grid" style={{ marginTop: "1.4rem" }}>
        <div>
          <div className="pill">
            <span className="pill-dot" />
            Trilha de conteúdos
          </div>
          <p className="subtitle" style={{ marginTop: "0.4rem" }}>
            Comece entendendo a linguagem, depois avance para arrays, vetores, matrizes,
            tabela hash, POO, Spring Boot e até lógica com Portugol.
          </p>
        </div>
        <div>
          <div className="pill">
            <span className="pill-dot" />
            Estude do seu jeito
          </div>
          <p className="subtitle" style={{ marginTop: "0.4rem" }}>
            Registre anotações por tópico, revise quando quiser e teste seu conhecimento
            com quizzes focados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

