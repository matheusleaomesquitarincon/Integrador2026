import { http } from "./http";

export const listQuestions = (topic) => {
  const query = topic && topic !== "all" ? `?topic=${encodeURIComponent(topic)}` : "";
  return http.get(`/community/questions${query}`);
};

export const getQuestion = (id) => http.get(`/community/questions/${id}`);

export const createQuestion = (payload) => http.post("/community/questions", payload);

export const updateQuestion = (id, payload) => http.put(`/community/questions/${id}`, payload);

export const deleteQuestion = (id) => http.delete(`/community/questions/${id}`);

export const toggleQuestionLike = (id) => http.post(`/community/questions/${id}/like`, {});

export const listAnswers = (questionId) => http.get(`/community/questions/${questionId}/answers`);

export const createAnswer = (questionId, payload) =>
  http.post(`/community/questions/${questionId}/answers`, payload);

export const updateAnswer = (id, payload) => http.put(`/community/answers/${id}`, payload);

export const deleteAnswer = (id) => http.delete(`/community/answers/${id}`);

export const toggleAnswerLike = (id) => http.post(`/community/answers/${id}/like`, {});

export const acceptAnswer = (id) => http.post(`/community/answers/${id}/accept`, {});
