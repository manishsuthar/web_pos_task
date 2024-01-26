// Main.js (frontend)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Main = () => {
  const [walletBalances, setWalletBalances] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch and set the user's wallet balance on component mount
    const fetchWalletBalance = async () => {
      try {
        const balances = await api.getWalletBalances();
        setWalletBalances(balances);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setError('Error fetching wallet balance. Please try again later.');
      }
    };

    fetchWalletBalance();
  }, []);

  return (
    <div>
      <header className="bg-primary text-white text-center py-3">
        <h2>WebPOS</h2>
        <div>
          {walletBalances.length > 0 ? (
            <p>
              {walletBalances.map((balance:any, index) => (
                <span key={index}>
                  {balance.currency}: ${balance.balance}&nbsp;&nbsp;
                </span>
              ))}
            </p>
          ) : (
            <p>Loading wallet balances...</p>
          )}
        </div>
      </header>

      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/main">Home</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/main/catalogue">Catalogue</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/main/ordering">Ordering</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/main/orders">Orders</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="mt-4">
          {/* Your main content goes here */}
          <h1>Main Page Content</h1>
        </div>

        {error && <p className="mt-3 text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Main;
