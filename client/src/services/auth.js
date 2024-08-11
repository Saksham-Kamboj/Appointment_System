import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  const { token } = response.data;
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const checkUserExists = async () => {
  try {
    const response = await api.get("/users/check");
    return response.data.exists;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
};
