import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    members: 0,
    products: 0,
    buyers: 0,
    transactions: 0,
    pendingPayments: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [membersRes, productsRes, buyersRes, transactionsRes, paymentsRes] = await Promise.all([
        axios.get('/api/members'),
        axios.get('/api/products'),
        axios.get('/api/buyers'),
        axios.get('/api/transactions'),
        axios.get('/api/payments')
      ]);

      const members = membersRes.data;
      const products = productsRes.data;
      const buyers = buyersRes.data;
      const transactions = transactionsRes.data;
      const payments = paymentsRes.data;

      setStats({
        members: members.length,
        products: products.length,
        buyers: buyers.length,
        transactions: transactions.length,
        pendingPayments: payments.filter(p => p.status === 'pending').length
      });

      // Get recent transactions (last 5)
      const recent = transactions
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
        .slice(0, 5);
      setRecentTransactions(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Aperçu de la coopérative</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.members}</div>
          <div className="stat-label">Adhérents actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.products}</div>
          <div className="stat-label">Produits collectés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.buyers}</div>
          <div className="stat-label">Acheteurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.transactions}</div>
          <div className="stat-label">Transactions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pendingPayments}</div>
          <div className="stat-label">Paiements en attente</div>
        </div>
      </div>

      <div className="table-container">
        <h3>Transactions récentes</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Acheteur</th>
              <th>Adhérent</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>{transaction.product_name}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.buyer_name}</td>
                <td>{transaction.member_name}</td>
                <td>{transaction.total_amount.toFixed(2)} FCFA</td>
                <td>
                  <span className={`badge badge-${transaction.status === 'completed' ? 'success' : 'warning'}`}>
                    {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
