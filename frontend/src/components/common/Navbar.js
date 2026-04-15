import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cartService } from '../../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user && user.userType === 'user') {
      cartService.getCart()
        .then(res => setCartCount(res.data.data?.length || 0))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/home" className="logo">
        <i className="fas fa-book-open"></i> The Bookshelf
      </Link>
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '1.5rem' }}
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
