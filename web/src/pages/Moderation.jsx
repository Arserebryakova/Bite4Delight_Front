// src/pages/Moderation.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const StatusIcon = ({ status }) => {
    if (status === 'Принят') {
      return (
        <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    if (status === 'Отклонен') {
      return (
        <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  const statusStyles = {
    'На модерации': 'bg-yellow-200 text-gray-800',
    Отклонен:      'bg-red-200    text-red-800',
    Принят:        'bg-green-200  text-green-800',
  };

export default function Moderation() {
	const [reviews, setReviews]     = useState([])
	const [loading, setLoading]     = useState(true)
	const [error, setError]         = useState(null)
	useEffect(() => {
    fetch(
      `/api/reviews/`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        return res.json()
      })
      .then((data) => setReviews(data))
      .catch((err) => {
        console.error('Error loading moderation list:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-gray-500 dark:text-gray-400">Загрузка...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-red-600">Не удалось загрузить отзывы.</span>
      </div>
    )
  }


  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-text-primary dark:text-text-primary-dark">
        Модерация отзывов
      </h1>

      {reviews.map((r) => (
        <Link to={`/review/${r.id}`} key={r.id} className="block">
          <div className="relative bg-bg-light dark:bg-bg-dark p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition">
            
            {/* Абсолютный бейдж только для десктопа */}
            <span
              className={`
                hidden md:inline-block
                absolute top-4 right-4
                px-3 py-1 rounded-full text-sm
                ${statusStyles[r.status]}
              `}
            >
              Статус: {r.status}
            </span>

            {/* HEADER: две колонки */}
            <div className="flex justify-between items-start">
              
              {/* Левая: place + title */}
              <div className="flex-1 pr-4 space-y-2">
                <div>
                  <span className="text-xs md:text-sm uppercase text-text-secondary dark:text-text-secondary-dark">
                    Место:
                  </span>{' '}
                  <span className="text-sm md:text-base font-medium text-text-primary dark:text-text-primary-dark">
                    {r.place}
                  </span>
                </div>
                <div>
                  <span className="text-xs md:text-sm uppercase text-text-secondary dark:text-text-secondary-dark">
                    Заголовок:
                  </span>{' '}
                  <span className="text-sm md:text-base font-medium text-text-primary dark:text-text-primary-dark">
                    {r.title}
                  </span>
                </div>
              </div>

              {/* Правая: user + date + иконка (мобилка) */}
              <div className="flex-shrink-0 text-right space-y-1">
              <div className="inline-block md:hidden mt-1">
                  <StatusIcon status={r.status} />
                </div>
                <div className="text-xs md:text-sm text-text-secondary dark:text-text-secondary-dark">
                  {r.user}
                </div>
                <div className="text-xs md:text-sm text-text-secondary dark:text-text-secondary-dark">
                  {r.date}
                </div>
                {/* Иконка будет видна всегда, но на десктопе под бейджем */}
                
              </div>
            </div>

            {/* Тело и оценка */}
            <p className="mt-4 text-xs md:text-sm text-text-secondary dark:text-text-secondary-dark">
              {r.content}
            </p>
            <div className="mt-4 text-sm md:text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Оценка: {r.rating}/10
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
