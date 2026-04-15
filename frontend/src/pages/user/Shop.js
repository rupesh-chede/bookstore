import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Toast from '../../components/common/Toast';
import { productService, cartService } from '../../services/api';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    productService.getAll()
      .then(res => setProducts(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await cartService.addToCart({
        name: product.name,
        price: product.price,
        quantity: quantities[product.id] || 1,
        image: product.image,
      });
      setToast({ message: 'Product added to cart!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error!', type: 'error' });
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h2 className="section-title">All Books</h2>

      {/* Search */}
      <div style={{ textAlign: 'center', padding: '0 5% 1rem' }}>
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.7rem 1.5rem', border: '1px solid #ddd', borderRadius: '30px',
            width: '100%', maxWidth: '400px', fontSize: '0.95rem',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No books found!</p>
      ) : (
        <div className="products-grid">
          {filtered.map(product => (
            <div className="product-card" key={product.id}>
              <img
                src={`${BACKEND_URL}/uploads/${product.image}`}
                alt={product.name}
                onError={(e) => { e.target.src = '/placeholder-book.jpg'; }}
              />
              <h3>{product.name}</h3>
              <p>Rs. {product.price}/-</p>
              <input
                type="number"
                min="1"
                defaultValue="1"
                onChange={(e) => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) })}
              />
              <br />
              <button className="product_btn" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </>
  );
};

export default Shop;
