import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeadingDropdownMenu } from "../components/tiptap-ui/heading-dropdown-menu";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { ImageUploadButton } from "../components/tiptap-ui/image-upload-button";
import { ImageUploadNode } from "../components/tiptap-node/image-upload-node";
import { handleImageUpload, MAX_FILE_SIZE } from "../lib/tiptap-utils";
import { blogApi } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { z } from "zod";

import "../components/tiptap-node/paragraph-node/paragraph-node.scss";

const postSchema = z.object({
  title: z.string().min(8, "Le titre doit contenir au moins 8 caractères").max(60, "Le titre ne peut pas dépasser 60 caractères"),
  description: z.string().min(12, "La description doit contenir au moins 12 caractères").max(250, "La description ne peut pas dépasser 250 caractères"),
  content: z.string().min(12, "Le contenu doit contenir au moins 12 caractères"),
  userId: z.number(),
});

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: ``,
  });

  const validateForm = () => {
    if (!editor) return false;
    const content = editor.getHTML();
    const userId = user?.id ?? 0;

    const result = postSchema.safeParse({ title, description, content, userId });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    if (!editor) {
      setError("L'éditeur n'est pas prêt");
      return;
    }

    setLoading(true);

    const content = editor.getHTML();
    const userId = user?.id!;

    try {
      await blogApi.createPost({ title, description, content, userId });
      navigate("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "Échec de la publication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-6 space-y-6"
        >
          {/* Titre */}
          <div>
            <input
              type="text"
              placeholder="Titre de l'article"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              onBlur={validateForm}
              className="w-full text-3xl font-bold outline-none border-none bg-transparent placeholder-gray-400"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <input
              type="text"
              placeholder="Description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              onBlur={validateForm}
              className="w-full text-xl outline-none border-none bg-transparent placeholder-gray-400"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-4 border-b pb-4">
            <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
            <ImageUploadButton text="Ajouter une image" />
          </div>

          {/* Editeur */}
          <div className="prose max-w-none border border-gray-200 rounded-lg p-3 bg-gray-50">
            <EditorContent editor={editor} />
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}

          {/* Erreur générale */}
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition"
          >
            {loading ? "Publication en cours..." : "Publier l'article"}
          </button>
        </form>
      </div>
    </EditorContext.Provider>
  );
}
