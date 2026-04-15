import React, { useState } from 'react';
import axios from 'axios';

const Traceability = () => {
  const [traceCode, setTraceCode] = useState('');
  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!traceCode.trim()) {
      setError('Veuillez entrer un code de traçabilité');
      return;
    }

    setLoading(true);
    setError('');
    setTraceData(null);

    try {
      const response = await axios.get(`/api/traceability/${traceCode}`);
      setTraceData(response.data);
    } catch (error) {
      setError('Produit non trouvé ou code de traçabilité invalide');
      console.error('Error fetching traceability data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setTraceCode(e.target.value.toUpperCase());
  };

  return (
    <div>
      <h1>Suivi de Traçabilité</h1>
      
      <div className="form-container">
        <h2>Rechercher un produit</h2>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Code de traçabilité</label>
            <input
              type="text"
              className="form-control"
              placeholder="Entrez le code de traçabilité (ex: ABC1234567)"
              value={traceCode}
              onChange={handleChange}
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      {traceData && (
        <div>
          <div className="form-container">
            <h2>Informations du produit</h2>
            <div className="product-info">
              <div className="info-row">
                <strong>Nom du produit:</strong> {traceData.product.name}
              </div>
              <div className="info-row">
                <strong>Quantité:</strong> {traceData.product.quantity} {traceData.product.unit}
              </div>
              <div className="info-row">
                <strong>Date de collecte:</strong> {new Date(traceData.product.collection_date).toLocaleDateString()}
              </div>
              <div className="info-row">
                <strong>Qualité:</strong> 
                <span className={`badge badge-${traceData.product.quality_grade === 'A' ? 'success' : traceData.product.quality_grade === 'B' ? 'warning' : 'danger'}`}>
                  Qualité {traceData.product.quality_grade}
                </span>
              </div>
              <div className="info-row">
                <strong>Code de traçabilité:</strong> <code>{traceData.product.traceability_code}</code>
              </div>
            </div>
          </div>

          <div className="form-container">
            <h2>Informations de l'adhérent</h2>
            <div className="member-info">
              <div className="info-row">
                <strong>Nom:</strong> {traceData.member.name}
              </div>
              <div className="info-row">
                <strong>Email:</strong> {traceData.member.email}
              </div>
            </div>
          </div>

          <div className="table-container">
            <h2>Historique des transactions</h2>
            {traceData.transactions.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Montant total</th>
                    <th>Acheteur</th>
                  </tr>
                </thead>
                <tbody>
                  {traceData.transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                      <td>{transaction.quantity}</td>
                      <td>{transaction.unit_price.toFixed(2)} FCFA</td>
                      <td>{transaction.total_amount.toFixed(2)} FCFA</td>
                      <td>{transaction.buyer_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune transaction enregistrée pour ce produit.</p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .info-row {
          margin-bottom: 0.5rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }
        
        .info-row:last-child {
          border-bottom: none;
        }
        
        .info-row strong {
          display: inline-block;
          width: 200px;
          color: #333;
        }
        
        code {
          background-color: #f8f9fa;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default Traceability;
