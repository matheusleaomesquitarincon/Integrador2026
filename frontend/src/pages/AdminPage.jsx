const collaborators = [
  { name: "Kaique Granato", role: "Colaborador QuizByte" },
  { name: "Matheus Leão", role: "Colaborador QuizByte" },
  { name: "Pedro Talalayv", role: "Colaborador QuizByte" },
  { name: "Kevin Matos", role: "Colaborador QuizByte" }
];

const AdminPage = () => {
  return (
    <div className="card">
      <h1 className="title">Admin · Equipe QuizByte</h1>
      <p className="subtitle">
        Lista de colaboradores responsáveis pelo desenvolvimento e conteúdo da
        plataforma.
      </p>

      <div className="contributors">
        {collaborators.map((c) => (
          <div key={c.name} className="contributor-card">
            <div className="contributor-name">{c.name}</div>
            <div className="contributor-role">{c.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;

