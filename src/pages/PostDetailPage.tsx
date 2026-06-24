import { useParams } from "react-router-dom";

export default function PostDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalle del Post</h1>

      <p>ID:</p>

      <p>{id}</p>
    </div>
  );
}