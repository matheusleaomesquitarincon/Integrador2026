import { http } from "./http";

export const listProgress = () => http.get("/progress");

export const markCompleted = (slug) =>
  http.post(`/progress/${encodeURIComponent(slug)}`, null);

export const unmarkCompleted = (slug) =>
  http.delete(`/progress/${encodeURIComponent(slug)}`);
