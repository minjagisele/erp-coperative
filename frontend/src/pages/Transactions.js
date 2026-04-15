import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    buyer_id: '',
    quantity: '',
    unit_price: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, productsRes, buyersRes] = await Promise.all([
        axios.get('/api/transactions'),
        axios.get('/api/products'),
        axios.get('/api/buyers')
      ]);
      setTransactions(transactionsRes.data);
      setProducts(productsRes.data.filter(p => p.status === 'collected'));
      setBuyers(buyersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/transactions', formData);
      setFormData({ product_id: '', buyer_id: '', quantity: '', unit_price: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'badge-warning', text: 'En attente' },
      'completed': { class: 'badge-success', text: 'Complété' },
      'cancelled': { class: 'badge-danger', text: 'Annulé' }
    };
    const statusInfo = statusMap[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Gestion des Transactions</h1>
      
      <div className="form-container">
        <h2>Créer une transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Produit</label>
            <select
              className="form-control"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.quantity} {product.unit} ({product.member_name})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Acheteur</label>
            <select
              className="form-control"
              name="buyer_id"
              value={formData.buyer_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un acheteur</option>
              {buyers.map((buyer) => (
                <option key={buyer.id} value={buyer.id}>
                  {buyer.name} {buyer.company && `(${buyer.company})`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantité</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Prix unitaire (FCFA)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Créer la transaction
          </button>
        </form>
      </div>

      <div className="table-container">
        <h2>Liste des transactions</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix unitaire</th>
              <th>Montant total</th>
              <th>Acheteur</th>
              <th>Adhérent</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>{transaction.product_name}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.unit_price.toFixed(2)} FCFA</td>
                <td>{transaction.total_amount.toFixed(2)} FCFA</td>
                <td>{transaction.buyer_name}</td>
                <td>{transaction.member_name}</td>
                <td>{getStatusBadge(transaction.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
