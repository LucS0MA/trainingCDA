
import { HeadingDropdownMenu  } from '../components/tiptap-ui/heading-dropdown-menu'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { ImageUploadButton } from '../components/tiptap-ui/image-upload-button'
import { ImageUploadNode } from '../components/tiptap-node/image-upload-node'
import { handleImageUpload, MAX_FILE_SIZE } from '../lib/tiptap-utils'

import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

export default function newArticlePage() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit,       Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
    ],
    content: `
          <h1>Heading 1</h1>
          <p>This is a paragraph of text.</p>
          <h2>Heading 2</h2>
          <p>This is another paragraph of text.</p>
        `,
  })

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ImageUploadButton text="Add" />
      </div>

      <EditorContent editor={editor} role="presentation" />
    </EditorContext.Provider>
  )
}