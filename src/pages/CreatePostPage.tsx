import { useState } from "react";

export default function CreatePostPage() {
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      descripcion,
      imagenes,
    });
  };

  return (
    <div>
      <h1>Nueva publicación</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="¿Qué estás pensando?"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL de imagen"
          value={imagenes}
          onChange={(e) => setImagenes(e.target.value)}
        />

        <button type="submit">
          Publicar
        </button>
      </form>
    </div>
  );
}