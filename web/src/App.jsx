import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import NewReview from './pages/NewReview';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import Moderation from './pages/Moderation';
import ReviewDetail from './pages/ReviewDetail';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate replace to="/feed" />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/new" element={<NewReview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/moderation" element={<Moderation />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
