import { http } from "./http";

// --- Endpoints legados (mantidos para compat) ---
export const listQuestions = (topic) => {
  const query = topic ? `?topic=${encodeURIComponent(topic)}` : "";
  return http.get(`/quizzes${query}`);
};

export const validateAnswer = (id, selectedOption) =>
  http.post(`/quizzes/${id}/validate`, selectedOption);

// --- Novos endpoints temáticos ---
export const listThemes = () => http.get("/quizzes/themes");

export const getTheme = (slug) => http.get(`/quizzes/themes/${encodeURIComponent(slug)}`);

export const submitAttempt = (slug, answers) =>
  http.post(`/quizzes/themes/${encodeURIComponent(slug)}/attempts`, { answers });

export const listHistory = (slug) =>
  http.get(`/quizzes/themes/${encodeURIComponent(slug)}/history`);
