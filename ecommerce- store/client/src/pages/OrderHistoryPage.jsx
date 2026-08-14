import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container page">
      <h1 className="section-title">My Orders</h1>
      {error && <Message>{error}</Message>}

      {!error && orders.length === 0 && (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>
            Start Shopping
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Paid</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-8).toUpperCase()}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>₹{o.totalPrice.toLocaleString('en-IN')}</td>
                <td>
                  <span className="badge">{o.status}</span>
                </td>
                <td>{o.isPaid ? '✓' : '✗'}</td>
                <td>
                  <Link to={`/orders/${o._id}`} className="btn btn-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
