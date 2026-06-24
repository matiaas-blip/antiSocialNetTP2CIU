import api from "./axios";

type RegisterData = {
  usuario: string;
  email: string;
  clave: string;
};

export const registerUser = async (data: RegisterData) => {
  const res = await api.post("/users", data);
  return res.data;
};