import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Toast from '../../components/common/Toast';
import { productService } from '../../services/api';

const BACKEND_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', image: null });
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = () => {
    productService.getAll()
      .then(res => setProducts(res.data.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price);
    fd.append('image', form.image);
    setLoading(true);
    try {
      await productService.add(fd);
      setToast({ message: 'Product added!', type: 'success' });
      setForm({ name: '', price: '', image: null });
      e.target.reset();
      fetchProducts();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Error adding product!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', editProduct.name);
    fd.append('price', editProduct.price);
    if (editProduct.newImage) fd.append('image', editProduct.newImage);
    setLoading(true);
    try {
      await productService.update(editProduct.id, fd);
      setToast({ message: 'Product updated!', type: 'success' });
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Update failed!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      setToast({ message: 'Product deleted!', type: 'success' });
      fetchProducts();
    } catch {
      setToast({ message: 'Delete failed!', type: 'error' });
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1>Manage Products</h1>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Add Product Form */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Product</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
              <label>Book Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Enter book name" />
            </div>
            <div className="form-group" style={{ margin: 0, flex: '1 1 120px' }}>
              <label>Price (Rs.)</label>
              <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="Price" />
            </div>
            <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
              <label>Book Cover Image</label>
              <input type="file" accept="image/*" required onChange={e => setForm({ ...form, image: e.target.files[0] })} />
            </div>
            <button type="submit" className="product_btn" disabled={loading} style={{ height: '42px' }}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Products Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No products added yet</td></tr>
            ) : products.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>
                  <img src={`${BACKEND_URL}/uploads/${p.image}`} alt={p.name}
                    onError={(e) => { e.target.src = '/placeholder-book.jpg'; }} />
                </td>
                <td>{p.name}</td>
                <td>Rs. {p.price}/-</td>
                <td>
                  <button className="product_btn" style={{ marginRight: '0.5rem' }} onClick={() => setEditProduct({ ...p, newImage: null })}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="product_btn product_del_btn" onClick={() => handleDelete(p.id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Modal */}
        {editProduct && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '450px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Edit Product</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Book Name</label>
                  <input type="text" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input type="number" min="0" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>New Image (optional)</label>
                  <input type="file" accept="image/*" onChange={e => setEditProduct({ ...editProduct, newImage: e.target.files[0] })} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="product_btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="product_btn product_del_btn" onClick={() => setEditProduct(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProducts;
