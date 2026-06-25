import api from "./axios";

export const createPost = async (data: {
  usuario: string;
  descripcion: string;
  images: string[];
}) => {
  const res = await api.post("/posts", data);
  return res.data;
};

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
