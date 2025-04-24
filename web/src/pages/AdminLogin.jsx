import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: вместо console.log — свой реальный запрос на /oauth/token
    console.log('Logging in as', credentials);
    // имитируем получение токена
    localStorage.setItem('oauth-token', 'fake-jwt-token');
    navigate('/moderation');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-inner-light dark:bg-inner-dark p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
          Администратор
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
              Логин
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-inner-light dark:bg-inner-dark 
                         text-text-primary dark:text-text-primary-dark"
            />
          </div>
          <div>
            <label className="block text-text-primary dark:text-text-secondary-dark mb-1">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-inner-light dark:bg-inner-dark 
                         text-text-primary dark:text-text-primary-dark"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
