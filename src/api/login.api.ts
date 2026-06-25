import api from "./axios";

export const loginUser = async (usuario: string, password: string) => {
  const res = await api.post("/auth/login", {
    usuario,
    password,
  });

  return res.data;
};