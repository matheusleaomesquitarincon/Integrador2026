import { http } from "./http";

export const listContents = () => http.get("/contents");
