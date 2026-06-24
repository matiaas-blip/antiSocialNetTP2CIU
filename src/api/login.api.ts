import api from "./axios";

export const loginUser = async (usuario: string, clave: string) => {
  const res = await api.post("/auth/login", {
    usuario,
    clave,
  });

  return res.data;
};