import api from "./axios";

export const createComment = (data: {
  postId: string;
  texto: string;
  usuario: string;
}) => {
  return api.post("/comments", data);
};

export const getCommentsByPost = (postId: string) => {
  return api.get(`/comments/post/${postId}`);
};