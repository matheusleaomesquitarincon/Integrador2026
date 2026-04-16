import { http } from "./http";

export const listNotes = () => http.get("/notes");

export const createNote = (note) => http.post("/notes", note);

export const updateNote = (id, note) => http.put(`/notes/${id}`, note);

export const deleteNote = (id) => http.delete(`/notes/${id}`);
