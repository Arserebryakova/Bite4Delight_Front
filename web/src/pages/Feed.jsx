// src/pages/Feed.jsx
import React, { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'

export default function Feed() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/reviews/?status=Принят`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
        return res.json()
      })
      .then(data => {
        // ожидаем, что бекенд отдаёт массив объектов { id, place, title, content, rating, user, date }
        setReviews(data)
      })
      .catch(err => {
        console.error('Error loading feed:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Загрузка...</p>
  if (error)   return <p>Ошибка: {error.message}</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
        Лента
      </h1>
      {reviews.map(r => (
        <ReviewCard
          id={r.id}
          place={r.place}
          title={r.title}
          content={r.content}
          rating={r.rating}
          user='Аноним'
          created_at={r.created_at}
		  status = {r.status}
        />
      ))}
    </div>
  )
}
