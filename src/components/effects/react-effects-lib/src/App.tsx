import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/app/page';
import RegisterPage from '@/app/register/page';
import { LaserFlow } from '@/components/effects/react-effects-lib/src/components/effects/LaserFlow';
import { PixelTrail } from '@/components/effects/react-effects-lib/src/components/effects/PixelTrail';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hack-black text-white overflow-x-hidden relative">
        <LaserFlow />
        <PixelTrail />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;