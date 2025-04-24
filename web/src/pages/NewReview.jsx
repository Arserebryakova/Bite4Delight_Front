// src/pages/NewReview.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function NewReview() {
  const places = [
    'Покровский бульвар 11. Столовая',
    'Покровский бульвар 11. Ресторан',
    'Покровский бульвар 11. Груша',
    'Покровский бульвар 11. Jeffrey\'s',
    'Покровский бульвар 11. "Стекляшка"',
    'Покровский бульвар 11. Вендинги'
  ];

  const [form, setForm] = useState({
    place: '',
    title: '',
    content: '',
    rating: 5
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const wrapperRef = useRef(null);

  // закрыть подсказки, если клик вне инпута/списка
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSug(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'place') {
      const val = value.toLowerCase();
      const filtered = places.filter(p =>
        p.toLowerCase().includes(val) && p.toLowerCase() !== val
      );
      setSuggestions(filtered);
      setShowSug(!!filtered.length);
    }
  };

  const handlePlaceSelect = (place) => {
    setForm(prev => ({ ...prev, place }));
    setShowSug(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert(JSON.stringify(form));
  };

  const pct = (form.rating / 10) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-bg-light dark:bg-bg-dark p-6 rounded-md
                    dark:shadow-[4px_4px_8px_#161616] shadow-[4px_4px_8px_#d1d9e6]">
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
        Новый отзыв
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Place autocomplete */}
        <div className="relative" ref={wrapperRef}>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Место
          </label>
          <input
            type="text"
            name="place"
            value={form.place}
            onChange={handleChange}
            onFocus={() => setShowSug(!!suggestions.length)}
            required
            className="w-full mt-1 p-2 border rounded bg-inner-light dark:bg-inner-dark 
                       text-text-primary dark:text-text-primary-dark"
            placeholder="Начните вводить..."
          />
          {showSug && (
            <ul className="absolute z-10 w-full bg-inner-light dark:bg-inner-dark border border-gray-300 dark:border-gray-600 rounded-md max-h-40 overflow-auto mt-1 shadow">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handlePlaceSelect(s)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-text-primary dark:text-text-primary-dark"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Заголовок
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded bg-inner-light dark:bg-inner-dark 
                       text-text-primary dark:text-text-primary-dark"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Отзыв
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="4"
            required
            className="w-full mt-1 p-2 border rounded bg-inner-light dark:bg-inner-dark 
                       text-text-primary dark:text-text-primary-dark"
          />
        </div>

        {/* Rating slider */}
        <div>
          <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
            Оценка: {form.rating}
          </label>
          <input
            type="range"
            name="rating"
            min="0"
            max="10"
            step="1"
            value={form.rating}
            onChange={handleChange}
            required
            className="w-full mt-1 rounded-lg appearance-none transition-all duration-300 ease-in-out"
            style={{ '--fill': `${pct}%` }}
          />
          <div className="flex justify-between text-sm mt-1 text-text-secondary dark:text-text-secondary-dark">
            {[...Array(11)].map((_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="px-10 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
