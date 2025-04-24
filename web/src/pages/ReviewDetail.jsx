// src/pages/ReviewDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Временно — позже замените реальным API
const reviewsData = [
  {
    id: 1,
    place: 'Покровский бульвар 11. Столовая',
    title: 'Холодный суп',
    content:
      'Суп оказался ледяным, пришлось подогревать дважды. Консистенция водянистая, вкус потерян.',
    rating: 4,
    user: 'Alice',
    date: '2025-05-10',
    status: 'Принят',
  },
  {
    id: 2,
    place: 'Покровский бульвар 11. Ресторан',
    title: 'Долго ждал',
    content:
      'Ожидание в очереди около часа, никто не извинился и не предложил ничего.',
    rating: 2,
    user: 'Bob',
    date: '2025-05-09',
    status: 'Отклонен',
  },
  {
    id: 3,
    place: 'Покровский бульвар 11. Груша',
    title: 'Вкусно и быстро',
    content: 'Очень порадовал сервис — все быстро и вкусно, порции большие.',
    rating: 9,
    user: 'Charlie',
    date: '2025-05-08',
    status: 'На модерации',
  },
];

export default function ReviewDetail() {
  const { id } = useParams();
  const reviewId = parseInt(id, 10);
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const found = reviewsData.find((r) => r.id === reviewId);
    if (!found) {
      // Если отзыв не найден — перенаправляем на ленту
      navigate('/feed', { replace: true });
      return;
    }
    setReview(found);
    setIsAuth(Boolean(localStorage.getItem('oauth-token')));
  }, [reviewId, navigate]);

  // Пока не загрузили — показываем лоадер
  if (review === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Загрузка...</span>
      </div>
    );
  }

  // Кнопки модерации меняют статус локально
  const handleAction = (newStatus) => {
    setReview((prev) => ({ ...prev, status: newStatus }));
  };

  // Цвет бейджа по статусу
  const statusClass =
    review.status === 'Принят'
      ? 'bg-green-200 text-green-800'
      : review.status === 'Отклонен'
      ? 'bg-red-200 text-red-800'
      : 'bg-yellow-200 text-yellow-800';

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
          {/* Заголовок */}
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

          {/* Текст отзыва */}
          <p className="mt-6 text-gray-700 dark:text-gray-300">{review.content}</p>

          {/* Оценка */}
          <div className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Оценка: {review.rating}/10
          </div>

          {/* Бейдж статуса */}
          <span
            className={`absolute top-6 right-6 px-3 py-1 rounded-full text-sm ${statusClass}`}
          >
            {review.status}
          </span>

          {/* Кнопки для модератора */}
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
  );
}
