// src/components/ThemeToggle.jsx
import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/outline'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded hover:bg-outer-light dark:hover:bg-outer-dark transition"
      aria-label="Toggle Theme"
    >
      {dark ? (
        <MoonIcon className="h-6 w-6 text-text-primary-dark" />
      ) : (
        <SunIcon className="h-6 w-6 text-text-primary" />
      )}
    </button>
  )
}
