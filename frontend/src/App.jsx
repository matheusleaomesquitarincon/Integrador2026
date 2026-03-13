import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StudyPage from "./pages/StudyPage";
import ContentPage from "./pages/ContentPage";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";

const App = () => {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo">
          <span className="logo-mark">Q</span>
          <span className="logo-text">QuizByte</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Início
          </NavLink>
          <NavLink to="/estudo" className="nav-link">
            Estudo
          </NavLink>
          <NavLink to="/conteudos" className="nav-link">
            Conteúdos
          </NavLink>
          <NavLink to="/quiz" className="nav-link">
            Quiz
          </NavLink>
          <NavLink to="/admin" className="nav-link">
            Admin
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/estudo" element={<StudyPage />} />
          <Route path="/conteudos" element={<ContentPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>QuizByte · Plataforma de estudos de Java</span>
      </footer>
    </div>
  );
};

export default App;

