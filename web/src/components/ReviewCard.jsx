import React from 'react';
import { Link } from 'react-router-dom';

export default function ReviewCard({id, place, title, content, rating, user, date, status}) {
  return (
    <Link to={`/review/${id}`} className="block">
    <div className="bg-inner-light dark:bg-bg-dark dark:shadow-[4px_4px_8px_#161616] shadow-[4px_4px_8px_#d1d9e6] rounded-lg p-6 mb-6">
      <div className="flex flex-wrap justify-between">
        <div className="">
          <h4 className="text-text-secondary dark:text-text-secondary-dark uppercase text-xs">Место</h4>
          <p className="text-text-primary dark:text-text-primary-dark text-lg font-medium">{place}</p>
          <h4 className="text-text-secondary dark:text-text-secondary-dark uppercase text-xs mt-2">Заголовок</h4>
          <p className="text-lg font-medium">{title}</p>
        </div>
        <div className="mt-4 sm:mt-0 text-right text-gray-500">
          <p>{user}</p>
          <p>{date}</p>
        </div>
      </div>
      <p className="mt-4 text-text-secondary dark:text-text-secondary-dark">{content}</p>
      <p className="mt-4 font-semibold">Оценка: {rating}/10</p>
      {status && (
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
          status==='Принят'      ? 'bg-green-200 text-green-800' :
          status==='Отклонен'    ? 'bg-red-200 text-red-800' :
          'bg-yellow-200 text-yellow-800'
        }`}>
          {status}
          </span>
      )}
    </div>
    </Link>
  );
}
