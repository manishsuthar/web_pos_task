import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';


const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>({id:'test',status:'test'});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await api.getOrderDetails(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Error fetching order details. Please try again later.');
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="container mt-4">
      <h1>Order Details</h1>

      {error ? (
        <p className="text-danger">{error}</p>
      ) : (
        order && (
          <div>
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            {/* Add more order details as needed */}
          </div>
        )
      )}

      {error && <p className="mt-3 text-danger">{error}</p>}
    </div>
  );
};

export default OrderDetails;
