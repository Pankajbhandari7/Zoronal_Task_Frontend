import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';

function App() {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Navbar />
      <main className="pt-[80px] pb-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/company/:id" element={<CompanyPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
