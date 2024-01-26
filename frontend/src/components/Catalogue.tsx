// Catalogue.js (frontend)

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Catalogue = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<any>([]);

  useEffect(() => {
    // Fetch the digital gift card catalogue from the API on component mount
    const fetchCatalogue = async () => {
      try {
        const catalogueData = await api.getCatalogue();
        setGiftCards(catalogueData);
      } catch (error) {
        console.error('Error fetching catalogue:', error);
        setError('Error fetching catalogue. Please try again later.');
      }
    };

    fetchCatalogue();
  }, []);

  const addToCart = (card:any) => {
    setCart([...cart, card]);
  };

  return (
    <div className="container mt-4">
      <h1>Catalogue Page</h1>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        {error ? (
          <p className="text-danger">{error}</p>
        ) : (
          giftCards.map((card:any) => (
            <div key={card.id} className="col mb-4">
              <div className="card">
                <img src="https://via.placeholder.com/150" className="card-img-top" alt={`Gift Card ${card.id}`} />
                <div className="card-body">
                  <h5 className="card-title">{card.name}</h5>
                  <p className="card-text">Price: ${card.price}</p>
                  <button className="btn btn-primary" onClick={() => addToCart(card)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="list-group">
            {cart.map((item:any, index:number) => (
              <li key={index} className="list-group-item">
                {item.name} - ${item.price}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="mt-3 text-danger">{error}</p>}
    </div>
  );
};

export default Catalogue;
