// Orders.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the list of orders from the API on component mount
    const fetchOrders = async () => {
      try {
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders. Please try again later.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Orders Page</h1>

      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <ul className="list-group">
          {orders.map((order:any) => (
            <li key={order.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <h5>Order ID: {order.id}</h5>
                  <p>Status: {order.status}</p>
                </div>
                <div>
                  <Link to={`/main/orders/${order.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-3 text-danger">{error}</p>}
    </div>
  );
};

export default Orders;
