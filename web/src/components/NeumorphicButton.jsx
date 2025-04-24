import React from 'react';

export default function NeumorphicButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-[#f0f0f3]              /* светлый фон */
        px-5 py-2.5               /* отступы */
        rounded-xl                /* скруглённые углы */
        text-gray-700
        transition-shadow duration-300 hover:duration-500 ease-in-out
        dark:bg-[#343434]
        dark:text-text-primary-dark
        dark:hover:bg-[#202020]
        /* default: выпуклая тень */
        shadow-[2px_2px_4px_#d1d9e6,-2px_-2px_4px_#ffffff]
        
        /* hover: внутренняя тень (concave) */
        
        hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]
        

        /* active (pressed): более «глубокая» внутренняя тень */
        active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]
        /* default: выпуклая тень */
        dark:shadow-[2px_2px_4px_#363636,-2px_-2px_4px_#202020]

        /* hover: внутренняя тень (concave) */
        
        dark:hover:shadow-[inset_2px_2px_4px_#161616,inset_-2px_-2px_4px_#101010]
        

        /* active (pressed): более «глубокая» внутренняя тень */
        dark:active:shadow-[inset_4px_4px_8px_#101010,inset_-4px_-4px_8px_#000000]
      `}
    >
      {children}
    </button>
  );
}
