import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Toast from '../../components/common/Toast';
import { cartService, orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', number: '', email: '', method: 'cash on delivery', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cartService.getCart()
      .then(res => setCartItems(res.data.data || []))
      .catch(() => {});
  }, []);

  const grandTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setToast({ message: 'Your cart is empty!', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await orderService.placeOrder(form);
      setToast({ message: 'Order placed successfully!', type: 'success' });
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Order failed!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ padding: '2rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Order Summary */}
        <div>
          <h2 className="section-title" style={{ textAlign: 'left', paddingLeft: 0 }}>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', background: 'white', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <img
                src={`${BACKEND_URL}/uploads/${item.image}`}
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div>
                <h3 style={{ marginBottom: '0.3rem' }}>{item.name}</h3>
                <p>Price: Rs. {item.price}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          <h3 style={{ color: 'var(--primary)', marginTop: '1rem' }}>Grand Total: Rs. {grandTotal}/-</h3>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="section-title" style={{ textAlign: 'left', paddingLeft: 0 }}>Delivery Details</h2>
          <div className="form-container" style={{ margin: 0 }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} required placeholder="Phone number" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="Email address" />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
                  <option value="cash on delivery">Cash on Delivery</option>
                  <option value="gpay">GPay</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  required
                  placeholder="Enter full address"
                  rows="4"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '8px', resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
