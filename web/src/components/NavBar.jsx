// src/components/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NeumorphicButton from './NeumorphicButton';
import logo from '../resources/Bite_for_Delight_logo.png';
import logo_dark from '../resources/Bite_for_Delight_logo_dark.png';
import ThemeToggle from './ThemeToggle';
import { UserIcon } from '@heroicons/react/outline';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('oauth-token'));
  }, []);

  return (
    <nav className="text-gray-800 dark:text-gray-200">
      <div
        className={`
          lg:w-[98%] lg:ml-[1%] lg:mr-[1%]
          lg:bg-bg-outer-light dark:lg:bg-[#242424]
          lg:rounded-bl-[1rem] lg:rounded-br-[1rem]
          shadow-[4px_4px_8px_#d1d9e6] dark:shadow-[4px_4px_8px_#161616]
          bg-white dark:bg-[#242424]
        `}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          {/* ЛЕВАЯ ГРУППА: логотип + разделы */}
          <div className="flex items-center space-x-4">
            <Link to="/feed" className="flex items-center">
              <img
                src={logo}
                alt="Bite for Delight"
                className="h-12 mr-2 block dark:hidden"
              />
              <img
                src={logo_dark}
                alt="Bite for Delight"
                className="h-12 mr-2 hidden dark:block"
              />
            </Link>
            <div className="hidden sm:flex items-center space-x-4">
            <NeumorphicButton onClick={() => navigate('/new')}>
              Новый отзыв
            </NeumorphicButton>
            <NeumorphicButton onClick={() => navigate('/feed')}>
              Лента
            </NeumorphicButton>
            {isAuth && (
              <NeumorphicButton onClick={() => navigate('/moderation')}>
                Модерация
              </NeumorphicButton>
            )}
            <NeumorphicButton onClick={() => navigate('/dashboard')}>
              Дашборды
            </NeumorphicButton>
            <NeumorphicButton onClick={() => navigate('/about')}>
              О нас
            </NeumorphicButton>
            </div>
          </div>

          {/* ПРАВАЯ ГРУППА: переключатель темы + вход */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button
            onClick={() => navigate('/login')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Login"
            >
              <UserIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
              </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden px-3 py-2"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? '✖️' : '☰'}
          </button>
        </div>

        {/* --------------- Плавное мобильное меню --------------- */}
        <div
          className={`
            md:hidden
            bg-white dark:bg-[#242424]
            overflow-hidden
            transition-all duration-300 ease-in-out
            ${open ? 'max-h-[320px] pb-4' : 'max-h-0'}
          `}
        >
          <button onClick={() => { setOpen(false); navigate('/new'); }}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Новый отзыв
          </button>
          <button onClick={() => { setOpen(false); navigate('/feed'); }}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Лента
          </button>
          {isAuth && (
            <button onClick={() => { setOpen(false); navigate('/moderation'); }}
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Модерация
            </button>
          )}
          <button onClick={() => { setOpen(false); navigate('/dashboard'); }}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Дашборды
          </button>
          <button onClick={() => { setOpen(false); navigate('/about'); }}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            О нас
          </button>
          <button onClick={() => { setOpen(false); navigate('/login'); }}
            className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Войти
          </button>
        </div>
      </div>
    </nav>
  );
}
