import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ERP Coopérative
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Tableau de bord
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/members" className={`nav-link ${isActive('/members') ? 'active' : ''}`}>
              Adhérents
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              Produits
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/buyers" className={`nav-link ${isActive('/buyers') ? 'active' : ''}`}>
              Acheteurs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/transactions" className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}>
              Transactions
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/payments" className={`nav-link ${isActive('/payments') ? 'active' : ''}`}>
              Paiements
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/traceability" className={`nav-link ${isActive('/traceability') ? 'active' : ''}`}>
              Traçabilité
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
