import api from "./axios";

type RegisterData = {
  usuario: string;
  email: string;
  password: string;
};

export const registerUser = async (data: RegisterData) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};