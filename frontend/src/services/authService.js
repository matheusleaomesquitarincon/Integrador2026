import { http } from "./http";

export const register = (data) => http.post("/auth/register", data);

export const login = (credentials) => http.post("/auth/login", credentials);

export const logout = () => http.post("/auth/logout", {});

export const fetchMe = () => http.get("/auth/me");
