import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { orderService } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.getMyOrders()
      .then(res => setOrders(res.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h2 className="section-title">My Orders</h2>
        {orders.length === 0 ? (
          <p className="empty">No orders placed yet!</p>
        ) : (
          orders.map(order => (
            <div className="order-box" key={order.id}>
              <p>Placed on: <span>{order.placedOn}</span></p>
              <p>Name: <span>{order.name}</span></p>
              <p>Phone: <span>{order.number}</span></p>
              <p>Email: <span>{order.email}</span></p>
              <p>Address: <span>{order.address}</span></p>
              <p>Payment Method: <span>{order.method}</span></p>
              <p>Products: <span>{order.totalProducts}</span></p>
              <p>Total Price: <span>Rs. {order.totalPrice}/-</span></p>
              <p>
                Payment Status:{' '}
                <span className={`badge ${order.paymentStatus === 'pending' ? 'pending' : 'completed'}`}>
                  {order.paymentStatus}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
