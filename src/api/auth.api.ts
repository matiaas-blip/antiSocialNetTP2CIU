import api from "./axios";

export const loginUser = async (
  email: string,
  clave: string
) => {
  const res = await api.post("/auth/login", {
    email,
    clave,
  });

  return res.data;
};