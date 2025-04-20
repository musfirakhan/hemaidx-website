import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import VirtualStaining from './pages/VirtualStaining';
import Classification from './pages/Classification';
import TryNow from './pages/TryNow';
import Device from './pages/Device';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/device" element={<Device />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/try-now" element={<TryNow />} />
            <Route path="/try-now/staining" element={<VirtualStaining />} />
            <Route path="/try-now/classification" element={<Classification />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;