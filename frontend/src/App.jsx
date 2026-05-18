import { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StudyPage from "./pages/StudyPage";
import ContentPage from "./pages/ContentPage";
import ContentDetailPage from "./pages/ContentDetailPage";
import CertificatePage from "./pages/CertificatePage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import CommunityPage from "./pages/CommunityPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import Icon from "./components/Icon";
import { useAuth } from "./contexts/AuthContext";

const THEME_KEY = "quizbyte-theme";

const getInitialTheme = () => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") || "light";
};

const App = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignora storage indisponível
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  if (loading) {
    return <div className="auth-loading">Carregando...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo">
          <img src="/logo.png" alt="QuizByte" className="logo-mark" />
          <span className="logo-text">QuizByte</span>
        </div>
        <div className="header-actions">
          <nav className="nav">
            <NavLink to="/" end className="nav-link">
              Início
            </NavLink>
            <NavLink to="/conteudos" className="nav-link">
              Conteúdos
            </NavLink>
            <NavLink to="/estudo" className="nav-link">
              Bloco de Notas
            </NavLink>
            <NavLink to="/quiz" className="nav-link">
              Quiz
            </NavLink>
            <NavLink to="/comunidade" className="nav-link">
              Comunidade
            </NavLink>
            <NavLink to="/perfil" className="nav-link">
              Perfil
            </NavLink>
          </nav>

          <div className="user-menu">
            <span className="user-name">{user.username}</span>
            <button
              type="button"
              className="logout-btn"
              onClick={logout}
              title="Sair"
            >
              Sair
            </button>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
          </button>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/conteudos" element={<ContentPage />} />
          <Route path="/conteudos/:slug" element={<ContentDetailPage />} />
          <Route path="/certificado/:trailId" element={<CertificatePage />} />
          <Route path="/estudo" element={<StudyPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/comunidade" element={<CommunityPage />} />
          <Route path="/comunidade/:id" element={<QuestionDetailPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>QuizByte · Plataforma de estudos de Java</span>
      </footer>
    </div>
  );
};

export default App;
