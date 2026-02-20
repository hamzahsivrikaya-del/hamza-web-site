'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import { useState } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
}

const colorPresets = [
  { label: 'Beyaz', value: '#F5F0E8' },
  { label: 'Kırmızı', value: '#DC2626' },
  { label: 'Turuncu', value: '#F97316' },
  { label: 'Mavi', value: '#3B82F6' },
  { label: 'Yeşil', value: '#22C55E' },
]

export default function RichTextEditor({ content, onChange }: Props) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-sm leading-relaxed text-text-primary',
      },
    },
  })

  if (!editor) return null

  function addImage() {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-surface">
        {/* Bold */}
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Kalın"
        >
          <span className="font-bold text-xs">B</span>
        </ToolbarButton>

        {/* Italic */}
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="İtalik"
        >
          <span className="italic text-xs">I</span>
        </ToolbarButton>

        {/* Underline */}
        <ToolbarButton
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Altı çizili"
        >
          <span className="underline text-xs">U</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* H2 */}
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Başlık 2"
        >
          <span className="text-xs font-semibold">H2</span>
        </ToolbarButton>

        {/* H3 */}
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Başlık 3"
        >
          <span className="text-xs font-semibold">H3</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Bullet list */}
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Madde listesi"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Hizalama */}
        <ToolbarButton
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Sola hizala"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h18" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Ortala"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M6 12h12M3 18h18" />
          </svg>
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Sağa hizala"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M9 12h12M3 18h18" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Renk */}
        <div className="relative">
          <ToolbarButton
            active={showColorPicker}
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Metin rengi"
          >
            <div className="w-4 h-4 rounded border border-border" style={{
              background: 'linear-gradient(135deg, #DC2626, #F97316, #3B82F6, #22C55E)'
            }} />
          </ToolbarButton>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg p-2 flex gap-1.5 z-10 shadow-lg">
              {colorPresets.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    editor.chain().focus().setColor(c.value).run()
                    setShowColorPicker(false)
                  }}
                  className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
              <button
                onClick={() => {
                  editor.chain().focus().unsetColor().run()
                  setShowColorPicker(false)
                }}
                className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform cursor-pointer flex items-center justify-center text-text-secondary"
                title="Rengi kaldır"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Görsel */}
        <div className="relative">
          <ToolbarButton
            active={showImageInput}
            onClick={() => setShowImageInput(!showImageInput)}
            title="Görsel ekle"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </ToolbarButton>
          {showImageInput && (
            <div className="absolute top-full right-0 mt-1 bg-surface border border-border rounded-lg p-3 z-10 shadow-lg flex gap-2 min-w-[280px]">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Görsel URL'si"
                className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-primary/50 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && addImage()}
              />
              <button
                onClick={addImage}
                className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
              >
                Ekle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarButton({ active, onClick, title, children }: {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
        active
          ? 'bg-primary/20 text-primary'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
      }`}
    >
      {children}
    </button>
  )
}
