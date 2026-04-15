import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Toast from '../../components/common/Toast';
import { productService, cartService } from '../../services/api';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    productService.getFeatured()
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
      setToast({ message: err.response?.data?.message || 'Error adding to cart', type: 'error' });
    }
  };

  return (
    <>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero */}
      <section className="hero">
        <h1>The Bookshelf</h1>
        <p>Explore, Discover, and Buy Your Favorite Books</p>
        <Link to="/shop" className="product_btn" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
          Discover More
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="section-title">Featured Books</h2>
        {products.length === 0 ? (
          <p className="empty">No products added yet!</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
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
      </section>

      {/* About Section */}
      <section className="about-section">
        <img src="/about.jpg" alt="About Bookshelf" onError={(e) => e.target.style.display='none'} />
        <div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Discover Our Story</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            At The Bookshelf, we are passionate about connecting readers with captivating stories,
            inspiring ideas, and a world of knowledge. Our bookstore is more than just a place to buy
            books; it's a haven for book enthusiasts, where the love for literature thrives.
          </p>
          <Link to="/about" className="product_btn">Read More</Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--primary)', color: 'white', padding: '4rem 5%', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Have Any Queries?</h2>
        <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Our dedicated team is here to assist you every step of the way.
        </p>
        <Link to="/contact" className="product_btn" style={{ background: 'white', color: 'var(--primary)' }}>
          Contact Us
        </Link>
      </section>

      <Footer />
    </>
  );
};

export default Home;
