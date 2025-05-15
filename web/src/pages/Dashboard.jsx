// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react'

export default function Dashboard() {
  const [places, setPlaces] = useState([])
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedPlace, setSelectedPlace] = useState('')
  const [approvedReviews, setApprovedReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [error, setError] = useState(null)
  const suggRef = useRef()

  // 1) Load places once
  useEffect(() => {
    fetch(`/api/locations`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load places (${res.status})`)
        return res.json()
      })
      .then(data => setPlaces(data))
      .catch(err => {
        console.error('Error fetching places:', err)
        setError('Не удалось загрузить список мест.')
      })
  }, [])

  // 2) Filter suggestions on every query change
  useEffect(() => {
    if (!query) return setSuggestions([])
    const lower = query.toLowerCase()
    setSuggestions(
      places
        .filter(p => p.toLowerCase().includes(lower))
        .slice(0, 5)
    )
  }, [query, places])

  // 3) Fetch approved reviews & compute avg + summary when place selected
  useEffect(() => {
  if (!selectedPlace) return

  setLoadingReviews(true)
  setError(null)

  // 1) load approved reviews for this place
  fetch(
    `/api/reviews/approved/${encodeURIComponent(
      selectedPlace
    )}`
  )
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load reviews (${res.status})`)
      return res.json()
    })
    .then(revs => {
      setApprovedReviews(revs)

      // compute average
      const avg =
        revs.reduce((sum, r) => sum + r.rating, 0) / (revs.length || 1)
      setAvgRating(avg.toFixed(1))

      // 2) call your Go-backed summarizer
      setLoadingSummary(true)
      return fetch(
        `/api/summarize`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // your Go handler expects { texts: [...] }
            texts: revs.map(r => r.content)
          })
        }
      )
    })
    .then(res => {
      if (!res.ok) throw new Error(`Summary failed (${res.status})`)
      return res.json()
    })
    .then(data => {
      setSummary(data.summary)
    })
    .catch(err => {
      console.error(err)
      setError('Не удалось загрузить отзывы или сгенерировать описание.')
    })
    .finally(() => {
      setLoadingReviews(false)
      setLoadingSummary(false)
    })
}, [selectedPlace])


  // click-away to hide suggestions
  useEffect(() => {
    function onClick(e) {
      if (suggRef.current && !suggRef.current.contains(e.target)) {
        setSuggestions([])
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const handleSelect = place => {
    setSelectedPlace(place)
    setQuery(place)
    setSuggestions([])
    setSummary('')
    setAvgRating(null)
  }

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
            {loadingSummary ? (
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
