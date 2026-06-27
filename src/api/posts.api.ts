import api from "./axios";

export const createPost = async (data: {
  usuario: string;
  descripcion: string;
  images: string[];
}) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const getPostsByUser = async (userId: string) => {
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

export const deletePost = async (postId: string, token: string) => {
  const res = await api.delete(`/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
