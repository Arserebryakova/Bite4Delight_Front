// src/pages/ReviewDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ReviewDetail() {
    const { id } = useParams()
  const reviewId = Number(id)
  const navigate = useNavigate()

  const [review, setReview]   = useState(null)
  const [isAuth, setIsAuth]   = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [actionError, setActionError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (Number.isNaN(reviewId)) {
      // invalid id in URL
      navigate('/feed', { replace: true })
      return
    }

    // Fetch review from API
    fetch(`/api/reviews/${reviewId}`)
      .then(res => {
        if (res.status === 404) {
          throw new Error('not found')
        }
        if (!res.ok) {
          throw new Error(`Server error ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        setReview(data)
        setIsAuth(!!localStorage.getItem('oauth-token'))
      })
      .catch(err => {
        console.error('Failed to load review:', err)
        if (err.message === 'not found') {
          navigate('/feed', { replace: true })
        } else {
          setError(err)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [reviewId, navigate])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Загрузка...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-red-600">Ошибка загрузки отзыва.</span>
      </div>
    )
  }

  const handleAction = async (newStatus) => {
    setActionError(null)
    setActionLoading(true)
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Failed to update: ${res.status}`)
      }
      // on success, update our local state
      setReview(r => ({ ...r, status: newStatus }))
    } catch (err) {
      console.error('Failed to change status:', err)
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const statusClass =
    review.status === 'Принят'
      ? 'bg-green-200 text-green-800'
      : review.status === 'Отклонен'
      ? 'bg-red-200 text-red-800'
      : 'bg-yellow-200 text-yellow-800'

  return (
    <div className="bg-bg-outer-light dark:bg-bg-dark min-h-screen py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline dark:text-blue-400 mb-6"
      >
        ← Назад
      </button>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-inner-light dark:bg-inner-dark p-6 rounded-xl shadow-lg relative">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm uppercase text-gray-400 dark:text-gray-500">
                Место
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {review.place}
              </p>

              <h3 className="mt-4 text-sm uppercase text-gray-400 dark:text-gray-500">
                Заголовок
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {review.title}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <div>{review.user}</div>
              <div>{review.date}</div>
            </div>
          </div>

          <p className="mt-6 text-gray-700 dark:text-gray-300">
            {review.content}
          </p>

          <div className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Оценка: {review.rating}/10
          </div>

          <span
            className={`absolute top-6 right-6 px-3 py-1 rounded-full text-sm ${statusClass}`}
          >
            {review.status}
          </span>

          {isAuth && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => handleAction('Принят')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Принять
              </button>
              <button
                onClick={() => handleAction('Отклонен')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Отклонить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
