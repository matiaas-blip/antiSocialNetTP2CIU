import api from "./axios";

export const getPostsByUser = async (userId: number) => {
  const res = await api.get(`/posts?userId=${userId}`);
  return res.data;
};

export const getPosts = async (
  page: number,
  limit: number = 10
) => {
  const res = await api.get(
    `/posts?page=${page}&limit=${limit}`
  );

  return res.data;
};