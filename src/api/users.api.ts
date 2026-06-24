import api from "./axios";

export const getUserById = async (id: number) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get(`/users`);
  return res.data;
};