import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    member_id: '',
    amount: '',
    payment_method: 'cash',
    due_date: '',
    transaction_id: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, membersRes, transactionsRes] = await Promise.all([
        axios.get('/api/payments'),
        axios.get('/api/members'),
        axios.get('/api/transactions')
      ]);
      setPayments(paymentsRes.data);
      setMembers(membersRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/payments', formData);
      setFormData({ 
        member_id: '', 
        amount: '', 
        payment_method: 'cash', 
        due_date: '', 
        transaction_id: '' 
      });
      fetchData();
    } catch (error) {
      console.error('Error creating payment:', error);
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
      'completed': { class: 'badge-success', text: 'Payé' },
      'failed': { class: 'badge-danger', text: 'Échoué' }
    };
    const statusInfo = statusMap[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const getPaymentMethodBadge = (method) => {
    const methodMap = {
      'cash': { class: 'badge-info', text: 'Espèces' },
      'bank_transfer': { class: 'badge-primary', text: 'Virement bancaire' },
      'mobile_money': { class: 'badge-success', text: 'Mobile Money' }
    };
    const methodInfo = methodMap[method] || { class: 'badge-secondary', text: method };
    return <span className={`badge ${methodInfo.class}`}>{methodInfo.text}</span>;
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Gestion des Paiements</h1>
      
      <div className="form-container">
        <h2>Créer un paiement</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Adhérent</label>
            <select
              className="form-control"
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un adhérent</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Montant (FCFA)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Méthode de paiement</label>
            <select
              className="form-control"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            >
              <option value="cash">Espèces</option>
              <option value="bank_transfer">Virement bancaire</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date d'échéance</label>
            <input
              type="date"
              className="form-control"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Transaction (optionnel)</label>
            <select
              className="form-control"
              name="transaction_id"
              value={formData.transaction_id}
              onChange={handleChange}
            >
              <option value="">Sélectionner une transaction</option>
              {transactions.map((transaction) => (
                <option key={transaction.id} value={transaction.id}>
                  {transaction.product_name} - {transaction.total_amount.toFixed(2)} FCFA
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Créer le paiement
          </button>
        </form>
      </div>

      <div className="table-container">
        <h2>Liste des paiements</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Adhérent</th>
              <th>Montant</th>
              <th>Méthode</th>
              <th>Date d'échéance</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td>{payment.member_name}</td>
                <td>{payment.amount.toFixed(2)} FCFA</td>
                <td>{getPaymentMethodBadge(payment.payment_method)}</td>
                <td>
                  {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : '-'}
                </td>
                <td>{getStatusBadge(payment.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
