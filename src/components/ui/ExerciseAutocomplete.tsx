'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function ExerciseAutocomplete({ value, onChange, placeholder, className }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [filtered, setFiltered] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Component mount'ta tüm egzersiz adlarını çek (1 kez)
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('workout_exercises')
      .select('name')
      .then(({ data }) => {
        if (!data) return
        const freq = new Map<string, number>()
        data.forEach(d => {
          const n = d.name.trim()
          if (n) freq.set(n, (freq.get(n) || 0) + 1)
        })
        const sorted = [...freq.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name)
        setSuggestions(sorted)
      })
  }, [])

  // Input değişince filtrele
  useEffect(() => {
    if (!value || value.length < 2) {
      setFiltered(suggestions.slice(0, 10))
    } else {
      const lower = value.toLowerCase()
      setFiltered(
        suggestions.filter(s => s.toLowerCase().includes(lower)).slice(0, 10)
      )
    }
    setHighlightIndex(-1)
  }, [value, suggestions])

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(name: string) {
    onChange(name)
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || filtered.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault()
      handleSelect(filtered[highlightIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((name, i) => (
            <li
              key={name}
              onMouseDown={() => handleSelect(name)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                i === highlightIndex
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-primary hover:bg-surface-hover'
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
