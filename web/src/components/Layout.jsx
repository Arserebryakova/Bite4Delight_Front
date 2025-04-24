import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-grow container mx-auto px-4 py-6 bg-outer-light dark:bg-outer-dark dark:shadow-[inset_-4px_-4px_8px_#242424] shadow-[inset_-4px_-4px_8px_#d1d9e6] rounded-lg m-2 p-6 mb-6">
    {children}
    </main>
    <Footer />
</div>

  );
}
