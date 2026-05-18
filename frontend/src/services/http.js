import { apiUrl } from "../config/api";

export class HttpError extends Error {
  constructor(status, body, path) {
    super(`HTTP ${status} em ${path}`);
    this.status = status;
    this.body = body;
    this.path = path;
  }
}

const parseBody = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") return null;
  if (!contentType.includes("application/json")) {
    try {
      const text = await res.text();
      return text || null;
    } catch (e) {
      return null;
    }
  }
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
};

const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/me", "/auth/logout"];

const request = async (path, options = {}) => {
  const { headers: extraHeaders, ...rest } = options;
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(extraHeaders || {}) },
    ...rest,
  });

  if (res.status === 204) return null;

  const body = await parseBody(res);

  if (!res.ok) {
    // Sessão expirou em algum endpoint protegido — avisa o app pra recarregar o auth
    if (res.status === 401 && !AUTH_PATHS.some((p) => path.startsWith(p))) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quizbyte:session-expired", { detail: { path } }));
      }
    }
    throw new HttpError(res.status, body, path);
  }

  return body;
};

export const http = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
