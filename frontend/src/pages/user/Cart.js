import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Toast from '../../components/common/Toast';
import { cartService } from '../../services/api';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  const fetchCart = () => {
    cartService.getCart()
      .then(res => setCartItems(res.data.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetchCart(); }, []);

  const grandTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdate = async (id, quantity) => {
    try {
      await cartService.updateCart(id, quantity);
      setToast({ message: 'Cart updated!', type: 'success' });
      fetchCart();
    } catch {
      setToast({ message: 'Update failed!', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item?')) return;
    await cartService.deleteItem(id);
    fetchCart();
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all cart items?')) return;
    await cartService.clearCart();
    fetchCart();
  };

  return (
    <>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="cart-container">
        <h2 className="section-title">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="empty">Your cart is empty! <Link to="/shop">Continue Shopping</Link></p>
        ) : (
          <>
            <div className="cart-box-grid">
              {cartItems.map(item => (
                <div className="cart-box" key={item.id}>
                  <button className="remove-btn" onClick={() => handleDelete(item.id)}>
                    <i className="fas fa-times"></i>
                  </button>
                  <img
                    src={`${BACKEND_URL}/uploads/${item.image}`}
                    alt={item.name}
                    onError={(e) => { e.target.src = '/placeholder-book.jpg'; }}
                  />
                  <h3>{item.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Rs. {item.price}/-</p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}>
                    <input
                      type="number"
                      min="1"
                      defaultValue={item.quantity}
                      style={{ width: '60px', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center' }}
                      onChange={(e) => handleUpdate(item.id, parseInt(e.target.value))}
                    />
                  </div>
                  <p style={{ marginTop: '0.5rem' }}>
                    Total: <strong>Rs. {item.price * item.quantity}/-</strong>
                  </p>
                </div>
              ))}
            </div>

            <div className="cart-total-box">
              <h2>Grand Total: <span>Rs. {grandTotal}/-</span></h2>
              <div className="btn-group">
                <button className="product_btn product_del_btn" onClick={handleClearAll}>
                  Delete All
                </button>
                <Link to="/shop" className="product_btn">Continue Shopping</Link>
                <Link to="/checkout" className={`product_btn ${grandTotal === 0 ? 'disabled' : ''}`}>
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
