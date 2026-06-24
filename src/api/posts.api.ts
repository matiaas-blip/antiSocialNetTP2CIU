import api from "./axios";

export const getPostsByUser = async (userId: number) => {
  const res = await api.get(`/posts?userId=${userId}`);
  return res.data;
};