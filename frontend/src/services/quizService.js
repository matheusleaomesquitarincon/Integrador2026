import { http } from "./http";

export const listQuestions = (topic) => {
  const query = topic ? `?topic=${encodeURIComponent(topic)}` : "";
  return http.get(`/quizzes${query}`);
};

export const validateAnswer = (id, selectedOption) =>
  http.post(`/quizzes/${id}/validate`, selectedOption);
