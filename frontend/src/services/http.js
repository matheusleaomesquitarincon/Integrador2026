import { apiUrl } from "../config/api";

const request = async (path, options = {}) => {
  const res = await fetch(apiUrl(path), {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} em ${path}`);
  }

  if (res.status === 204) return null;
  return res.json();
};

export const http = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
