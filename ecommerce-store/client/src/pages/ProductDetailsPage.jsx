import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewErr, setReviewErr] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewErr('');
    setReviewMsg('');
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setReviewMsg('Review submitted!');
      setComment('');
      load();
    } catch (err) {
      setReviewErr(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="container page"><Message>{error}</Message></div>;
  if (!product) return null;

  return (
    <div className="container page">
      <button className="btn btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%' }} />
        </div>

        <div>
          <span className="badge">{product.category}</span>
          <h1 style={{ margin: '12px 0' }}>{product.name}</h1>
          <div className="stars" style={{ marginBottom: 12 }}>
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
            <span style={{ color: 'var(--gray)', marginLeft: 8 }}>
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>
          <p className="product-card-price" style={{ fontSize: '2rem' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          <p style={{ margin: '16px 0', color: 'var(--gray)' }}>{product.description}</p>

          <div className="panel" style={{ marginTop: 20 }}>
            <div className="flex-between">
              <span>Status:</span>
              <strong style={{ color: product.countInStock > 0 ? 'green' : 'var(--red)' }}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
              </strong>
            </div>

            {product.countInStock > 0 && (
              <div className="flex-between" style={{ marginTop: 12 }}>
                <span>Quantity:</span>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 16 }}
              disabled={product.countInStock === 0}
              onClick={handleAddToCart}
            >
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <h2 className="section-title">Reviews ({product.reviews.length})</h2>

        {product.reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}

        <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
          {product.reviews.map((r) => (
            <div className="panel" key={r._id}>
              <div className="flex-between">
                <strong>{r.name}</strong>
                <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}
            </div>
          ))}
        </div>

        {user ? (
          <form className="panel" onSubmit={submitReview}>
            <h3 style={{ marginBottom: 16 }}>Write a Review</h3>
            {reviewErr && <Message>{reviewErr}</Message>}
            {reviewMsg && <Message type="success">{reviewMsg}</Message>}
            <div className="field">
              <label>Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} - {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][n - 1]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Comment</label>
              <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">
              Submit Review
            </button>
          </form>
        ) : (
          <Message type="error">Please log in to write a review.</Message>
        )}
      </div>
    </div>
  );
}
