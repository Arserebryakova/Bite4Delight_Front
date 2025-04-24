// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react'

const allPlaces = [
  'Покровский бульвар 11. Столовая',
  'Покровский бульвар 11. Ресторан',
  'Покровский бульвар 11. Груша',
  "Покровский бульвар 11. Jeffrey's",
  'Покровский бульвар 11. «Стекляшка»',
  'Покровский бульвар 11. Вендинги',
  // … другие заведения
]

// Временно: ваши отзывы с бэкенда или мок
const reviews = [
  { id:1, place:'Покровский бульвар 11. Столовая', rating:3, status:'Принят', content:'Суп ледяной, консистенция водянистая.' },
  { id:2, place:'Покровский бульвар 11. Столовая', rating:8, status:'Принят', content:'Быстро обслужили, порции большие.' },
  { id:3, place:'Покровский бульвар 11. Ресторан', rating:2, status:'Принят', content:'Ожидал больше часа, никто не извинился.' },
  { id:4, place:'Покровский бульвар 11. Ресторан', rating:9, status:'Принят', content:'Отличная атмосфера и вежливый персонал.' },
  // … прочие отзывы
]

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [avgRating, setAvgRating] = useState(null)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const suggRef = useRef()

  // при вводе фильтруем подсказки
  useEffect(() => {
    if (!query) return setSuggestions([])
    const lower = query.toLowerCase()
    setSuggestions(
      allPlaces
        .filter(p => p.toLowerCase().includes(lower))
        .slice(0, 5)
    )
  }, [query])

  // по клику на подсказку
  function handleSelect(place) {
    setSelectedPlace(place)
    setQuery(place)
    setSuggestions([])
  }

  // при выборе заведения — считаем средний рейтинг и запрашиваем summary
  useEffect(() => {
    if (!selectedPlace) return
  
    const approved = reviews.filter(r =>
      r.place === selectedPlace && r.status === 'Принят'
    )
  
    const avg =
      approved.reduce((sum, r) => sum + r.rating, 0) /
      (approved.length || 1)
    setAvgRating(avg.toFixed(1))
  
    setLoading(true)
    fetch("https://purple-horse-76.loca.lt/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place: selectedPlace,
        reviews: approved
      })
    })
      .then(res => res.json())
      .then(data => setSummary(data.summary))
      .catch(() => setSummary('Не удалось получить описание.'))
      .finally(() => setLoading(false))
  }, [selectedPlace])
  
  // закрываем дропдаун при клике вне
  useEffect(() => {
    function onClick(e) {
      if (suggRef.current && !suggRef.current.contains(e.target)) {
        setSuggestions([])
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
        Dashboard
      </h1>

      {/* Autocomplete */}
      <div className="relative" ref={suggRef}>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedPlace(null) }}
          placeholder="Выберите заведение..."
          className="
            w-full
            p-3
            border
            rounded-md
            bg-inner-light dark:bg-inner-dark
            text-text-primary dark:text-text-primary-dark
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-20 w-full bg-inner-light dark:bg-inner-dark border rounded-b-md shadow-lg overflow-hidden">
            {suggestions.map((p, i) => (
              <li
                key={i}
                onClick={() => handleSelect(p)}
                className="
                  px-4 py-2
                  hover:bg-outer-light dark:hover:bg-outer-dark
                  cursor-pointer
                  text-text-primary dark:text-text-primary-dark
                "
              >
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Карточка заведения */}
      {selectedPlace && (
        <div className="
            p-6
            bg-outer-light dark:bg-outer-dark
            rounded-xl
            shadow-md
            space-y-4
          ">
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            {selectedPlace}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              Средняя оценка:
            </span>
            <span className="text-4xl font-bold text-blue-600">
              {avgRating}/10
            </span>
          </div>

          <div className="prose prose-neutral dark:prose-invert">
            {loading ? (
              <p>Генерируем описание...</p>
            ) : (
              <p>{summary}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
