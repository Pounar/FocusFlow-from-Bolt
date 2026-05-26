import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '../stores'
import { Button } from '../components/ui/GlassCard'
import { FileText, Plus, Search, Pin, Trash2, CreditCard as Edit3, FolderOpen } from 'lucide-react'
import { format } from 'date-fns'
import type { Note } from '../types'

export function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredNotes = notes.filter((note: Note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [editContent])

  const handleCreateNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      userId: 'local',
      title: 'Untitled',
      content: '',
      contentType: 'markdown',
      folder: 'default',
      isPinned: false,
      isArchived: false,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addNote(note)
    setSelectedNote(note.id)
    setIsEditing(true)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleSelectNote = (noteId: string) => {
    const note = notes.find((n: Note) => n.id === noteId)
    if (note) {
      setSelectedNote(noteId)
      setEditTitle(note.title)
      setEditContent(note.content)
      setIsEditing(false)
    }
  }

  const handleSaveNote = () => {
    if (selectedNote) {
      updateNote(selectedNote, {
        title: editTitle || 'Untitled',
        content: editContent,
        updatedAt: new Date(),
      })
      setIsEditing(false)
    }
  }

  const handleTogglePin = (noteId: string) => {
    const note = notes.find((n: Note) => n.id === noteId)
    if (note) {
      updateNote(noteId, { isPinned: !note.isPinned })
    }
  }

  const currentNote = notes.find((n: Note) => n.id === selectedNote)

  return (
    <motion.div
      className="h-screen flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-72 border-r border-white/5 flex flex-col bg-[#0a0a0f]">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Notes</h1>
            <Button variant="primary" size="sm" onClick={handleCreateNote}>
              <Plus size={16} />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <AnimatePresence mode="popLayout">
            {sortedNotes.map((note: Note, index: number) => (
              <motion.button
                key={note.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSelectNote(note.id)}
                className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
                  selectedNote === note.id
                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-2">
                  {note.isPinned && (
                    <Pin size={12} className="text-indigo-400 mt-1 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {note.content.slice(0, 50) || 'No content'}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      {format(new Date(note.updatedAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {sortedNotes.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <FileText className="mx-auto mb-2 opacity-50" size={32} />
              <p className="text-sm">No notes yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0f0f14]">
        {currentNote ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xl font-bold bg-transparent border-b border-indigo-500/50 focus:outline-none px-1"
                    placeholder="Note title"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{currentNote.title}</h2>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button variant="primary" size="sm" onClick={handleSaveNote}>
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePin(currentNote.id)}
                    >
                      <Pin
                        size={16}
                        className={currentNote.isPinned ? 'text-indigo-400' : ''}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        deleteNote(currentNote.id)
                        setSelectedNote(null)
                      }}
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isEditing ? (
                <motion.textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full bg-transparent resize-none focus:outline-none text-zinc-300 leading-relaxed"
                  placeholder="Start typing..."
                  autoFocus
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ) : (
                <motion.div
                  className="prose prose-invert max-w-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {currentNote.content.split('\n').map((paragraph: string, i: number) => (
                    <p key={i} className="text-zinc-300 leading-relaxed mb-4">
                      {paragraph || '\u00A0'}
                    </p>
                  ))}
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <FolderOpen className="mx-auto mb-4 opacity-50" size={48} />
              <p className="text-lg mb-2">Select a note or create a new one</p>
              <Button variant="primary" onClick={handleCreateNote}>
                <Plus size={16} />
                New Note
              </Button>
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </motion.div>
  )
}
