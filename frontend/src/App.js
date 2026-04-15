import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Products from './pages/Products';
import Buyers from './pages/Buyers';
import Transactions from './pages/Transactions';
import Payments from './pages/Payments';
import Traceability from './pages/Traceability';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/products" element={<Products />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/traceability" element={<Traceability />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
