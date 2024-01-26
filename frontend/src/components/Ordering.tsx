import React, { useState } from 'react';
import api from '../services/api';

const Ordering = () => {
  const [selectedCard, setSelectedCard] = useState('');
  const [claimUrl, setClaimUrl] = useState('');
  const [error, setError] = useState('');

  const handleOrder = async () => {
    try {
      // Assuming selectedCard has the ID of the chosen gift card
      const orderData = await api.placeOrder({ cardId: selectedCard });

      // Assuming the API returns the claim URL on successful order placement
      setClaimUrl(orderData.claimUrl);
      setError('');
    } catch (error) {
      console.error('Error placing order:', error);
      setClaimUrl('');
      setError('Error placing order. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Ordering Page</h1>

      <div className="mb-3">
        <label htmlFor="selectCard" className="form-label">Select Gift Card:</label>
        <select
          id="selectCard"
          className="form-select"
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value)}
          required
        >
          <option value="">Select a Gift Card</option>
          <option value="1">Gift Card 1</option>
          <option value="2">Gift Card 2</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleOrder}>Place Order</button>

      {claimUrl && (
        <div className="mt-3">
          <p>Claim URL:</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${claimUrl}&size=150x150`}
            alt="QR Code"
          />
        </div>
      )}

      {error && <p className="mt-3 text-danger">{error}</p>}
    </div>
  );
};

export default Ordering;
