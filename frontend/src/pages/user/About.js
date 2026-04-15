import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const About = () => (
  <>
    <Navbar />
    <section className="about-section" style={{ minHeight: '60vh' }}>
      <img src="/about.jpg" alt="About" style={{ maxHeight: '400px' }}
        onError={(e) => e.target.style.display = 'none'} />
      <div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '2rem' }}>About The Bookshelf</h2>
        <p style={{ lineHeight: 1.9, color: 'var(--text-light)', marginBottom: '1rem' }}>
          At The Bookshelf, we are passionate about connecting readers with captivating stories,
          inspiring ideas, and a world of knowledge. Our bookstore is more than just a place to buy
          books — it's a haven for book enthusiasts, where the love for literature thrives.
        </p>
        <p style={{ lineHeight: 1.9, color: 'var(--text-light)', marginBottom: '1rem' }}>
          We carefully curate our collection to ensure every reader finds their perfect book, whether
          they're seeking adventure, wisdom, romance, or self-improvement.
        </p>
        <p style={{ lineHeight: 1.9, color: 'var(--text-light)' }}>
          Our team is dedicated to providing an exceptional shopping experience — from easy browsing
          to doorstep delivery. We believe every book tells a story, and every reader deserves to
          discover theirs.
        </p>
      </div>
    </section>
    <Footer />
  </>
);

export default About;
