const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiUrl = (path) => `${API_BASE}${path}`;

export const backendOrigin = () => {
  try {
    return new URL(API_BASE).origin;
  } catch (e) {
    return API_BASE.replace(/\/api\/?$/, "");
  }
};
