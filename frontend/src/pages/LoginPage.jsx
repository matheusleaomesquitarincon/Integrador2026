import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { HttpError } from "../services/http";

const LoginPage = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.pathname === "/register" ? "register" : "login";

  const [loginField, setLoginField] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    setError(null);
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === "login") {
      if (!loginField.trim() || !password) {
        setError("Informe username/email e senha.");
        return;
      }
    } else {
      if (!username.trim() || !email.trim() || !password) {
        setError("Preencha todos os campos.");
        return;
      }
      if (password.length < 8) {
        setError("A senha precisa ter no mínimo 8 caracteres.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(loginField.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }
    } catch (err) {
      if (err instanceof HttpError) {
        const backendMsg = err.body?.error;
        if (backendMsg) {
          setError(backendMsg);
        } else if (err.status === 401) {
          setError("Login ou senha inválidos.");
        } else if (err.status === 409) {
          setError("Username ou email já está em uso.");
        } else if (err.status === 400) {
          setError("Dados inválidos. Verifique os campos.");
        } else {
          setError("Algo deu errado. Tente novamente.");
        }
      } else {
        setError("Não foi possível conectar ao servidor.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card-pane">
        <div className="auth-card">
          <h1>{mode === "login" ? "Acessar QuizByte" : "Criar uma conta"}</h1>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Use seu username ou email para entrar."
              : "Suas anotações ficam vinculadas à sua conta."}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === "login" ? (
              <>
                <div className="label">Username ou email</div>
                <input
                  className="input"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  autoComplete="username"
                  disabled={submitting}
                />

                <div className="label">Senha</div>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={submitting}
                />
              </>
            ) : (
              <>
                <div className="label">Username (letras, números, _ . -)</div>
                <input
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={submitting}
                  maxLength={50}
                  placeholder="ex: pedro_talalayv"
                />

                <div className="label">Email</div>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={submitting}
                  maxLength={180}
                />

                <div className="label">Senha (mínimo 8 caracteres)</div>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={submitting}
                  minLength={8}
                />
              </>
            )}

            <button
              type="submit"
              className="button-primary auth-submit"
              disabled={submitting}
            >
              {submitting
                ? "Aguarde..."
                : mode === "login"
                ? "Entrar"
                : "Criar conta"}
            </button>
          </form>

          <div className="auth-switch">
            {mode === "login" ? (
              <>
                Não tem conta? <Link to="/register">Criar agora</Link>
              </>
            ) : (
              <>
                Já tem conta? <Link to="/login">Entrar</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="auth-art">
        <img src="/login-art.png" alt="Estude, pratique e progrida com QuizByte" />
      </div>
    </div>
  );
};

export default LoginPage;
