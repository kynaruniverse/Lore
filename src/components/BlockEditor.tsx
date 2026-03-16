import { useState, useEffect } from 'react'
import { GripVertical, Plus, Trash2, Type, Heading1, Heading2, Quote, List } from 'lucide-react'

type BlockType = 'text' | 'h1' | 'h2' | 'quote' | 'bullet'

interface Block {
  id: string
  type: BlockType
  content: string
}

interface BlockEditorProps {
  initialValue: string
  onChange: (markdown: string) => void
}

export default function BlockEditor({ initialValue, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([])

  // Parse initial markdown into blocks
  useEffect(() => {
    if (blocks.length === 0 && initialValue) {
      const lines = initialValue.split('\n').filter(l => l.trim() !== '')
      const parsedBlocks: Block[] = lines.map((line, i) => {
        let type: BlockType = 'text'
        let content = line

        if (line.startsWith('# ')) {
          type = 'h1'
          content = line.replace('# ', '')
        } else if (line.startsWith('## ')) {
          type = 'h2'
          content = line.replace('## ', '')
        } else if (line.startsWith('> ')) {
          type = 'quote'
          content = line.replace('> ', '')
        } else if (line.startsWith('- ')) {
          type = 'bullet'
          content = line.replace('- ', '')
        }

        return { id: `block-${i}-${Date.now()}`, type, content }
      })
      setBlocks(parsedBlocks.length > 0 ? parsedBlocks : [{ id: 'initial', type: 'text', content: '' }])
    } else if (blocks.length === 0) {
      setBlocks([{ id: 'initial', type: 'text', content: '' }])
    }
  }, [initialValue])

  // Convert blocks back to markdown
  useEffect(() => {
    const markdown = blocks.map(block => {
      switch (block.type) {
        case 'h1': return `# ${block.content}`
        case 'h2': return `## ${block.content}`
        case 'quote': return `> ${block.content}`
        case 'bullet': return `- ${block.content}`
        default: return block.content
      }
    }).join('\n\n')
    onChange(markdown)
  }, [blocks])

  const addBlock = (index: number, type: BlockType = 'text') => {
    const newBlock: Block = { id: `block-${Date.now()}`, type, content: '' }
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    setBlocks(newBlocks)
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b))
  }

  const changeBlockType = (id: string, type: BlockType) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, type } : b))
  }

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id))
    }
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, index) => (
        <div key={block.id} className="group relative flex items-start gap-2">
          {/* Block Controls */}
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
            <button type="button" className="p-1 hover:bg-accent rounded text-muted-foreground">
              <GripVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Block Type Selector */}
          <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 bg-card border border-border rounded-lg p-1 z-10 shadow-xl">
            <button type="button" onClick={() => changeBlockType(block.id, 'text')} className="p-1.5 hover:bg-accent rounded" title="Text"><Type className="w-4 h-4" /></button>
            <button type="button" onClick={() => changeBlockType(block.id, 'h1')} className="p-1.5 hover:bg-accent rounded" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
            <button type="button" onClick={() => changeBlockType(block.id, 'h2')} className="p-1.5 hover:bg-accent rounded" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
            <button type="button" onClick={() => changeBlockType(block.id, 'quote')} className="p-1.5 hover:bg-accent rounded" title="Quote"><Quote className="w-4 h-4" /></button>
            <button type="button" onClick={() => changeBlockType(block.id, 'bullet')} className="p-1.5 hover:bg-accent rounded" title="Bullet List"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => removeBlock(block.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
          </div>

          {/* Block Content */}
          <div className="flex-1">
            {block.type === 'h1' && (
              <input
                className="w-full bg-transparent text-3xl font-serif font-bold focus:outline-none py-1"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 1"
              />
            )}
            {block.type === 'h2' && (
              <input
                className="w-full bg-transparent text-2xl font-serif font-bold focus:outline-none py-1"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Heading 2"
              />
            )}
            {block.type === 'quote' && (
              <div className="border-l-4 border-primary pl-4 py-1">
                <textarea
                  className="w-full bg-transparent text-lg italic text-muted-foreground focus:outline-none resize-none"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder="Quote"
                  rows={1}
                />
              </div>
            )}
            {block.type === 'bullet' && (
              <div className="flex items-start gap-2 py-1">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <textarea
                  className="w-full bg-transparent focus:outline-none resize-none"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder="List item"
                  rows={1}
                />
              </div>
            )}
            {block.type === 'text' && (
              <textarea
                className="w-full bg-transparent focus:outline-none resize-none py-1 leading-relaxed"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Type '/' for commands or start writing..."
                rows={1}
                style={{ height: 'auto', minHeight: '1.5em' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = target.scrollHeight + 'px'
                }}
              />
            )}
          </div>

          {/* Add Block Button */}
          <button
            type="button"
            onClick={() => addBlock(index)}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white rounded-full p-0.5 hover:scale-110 z-10"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
