import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HeadingDropdownMenu } from "../components/tiptap-ui/heading-dropdown-menu"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { ImageUploadButton } from "../components/tiptap-ui/image-upload-button"
import { ImageUploadNode } from "../components/tiptap-node/image-upload-node"
import { handleImageUpload, MAX_FILE_SIZE } from "../lib/tiptap-utils"
import { blogApi } from "../lib/api"

import "../components/tiptap-node/paragraph-node/paragraph-node.scss"

export default function NewArticlePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

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
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!editor) {
      setError("L'éditeur n'est pas prêt")
      setLoading(false)
      return
    }

    const content = editor.getHTML()

    const postData = {
      title,
      description,
      content,
    }

    console.log(postData)

    try {
      await blogApi.createPost(postData)
      navigate("/")
    } catch (error: any) {
      setError(error.response?.data?.message || "Échec de la publication")
    } finally {
      setLoading(false)
    }
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-6 space-y-6"
        >
          {/* Titre */}
          <input
            type="text"
            placeholder="Titre de l'article"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold outline-none border-none bg-transparent placeholder-gray-400"
          />

          {/* Description */}
          <input
            type="text"
            placeholder="Description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xl outline-none border-none bg-transparent placeholder-gray-400"
          />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-4 border-b pb-4">
            <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
            <ImageUploadButton text="Ajouter une image" />
          </div>

          {/* Editeur */}
          <div className="prose max-w-none">
            <EditorContent editor={editor} />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Publication en cours..." : "Publier l'article"}
          </button>
        </form>
      </div>
    </EditorContext.Provider>
  )
}
