import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    quality_grade: 'A',
    member_id: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, membersRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/members')
      ]);
      setProducts(productsRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', formData);
      setFormData({ name: '', quantity: '', unit: 'kg', quality_grade: 'A', member_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating product:', error);
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
      'collected': { class: 'badge-info', text: 'Collecté' },
      'sold': { class: 'badge-success', text: 'Vendu' },
      'processed': { class: 'badge-warning', text: 'Traité' }
    };
    const statusInfo = statusMap[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Gestion des Produits</h1>
      
      <div className="form-container">
        <h2>Ajouter un produit</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du produit</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
            <label className="form-label">Unité</label>
            <select
              className="form-control"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="kg">Kilogrammes (kg)</option>
              <option value="l">Litres (l)</option>
              <option value="pieces">Pièces</option>
              <option value="tonnes">Tonnes</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Qualité</label>
            <select
              className="form-control"
              name="quality_grade"
              value={formData.quality_grade}
              onChange={handleChange}
            >
              <option value="A">Qualité A</option>
              <option value="B">Qualité B</option>
              <option value="C">Qualité C</option>
            </select>
          </div>
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
          <button type="submit" className="btn btn-primary">
            Ajouter le produit
          </button>
        </form>
      </div>

      <div className="table-container">
        <h2>Liste des produits</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Quantité</th>
              <th>Unité</th>
              <th>Qualité</th>
              <th>Date de collecte</th>
              <th>Adhérent</th>
              <th>Code traçabilité</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.unit}</td>
                <td>
                  <span className={`badge badge-${product.quality_grade === 'A' ? 'success' : product.quality_grade === 'B' ? 'warning' : 'danger'}`}>
                    Qualité {product.quality_grade}
                  </span>
                </td>
                <td>{new Date(product.collection_date).toLocaleDateString()}</td>
                <td>{product.member_name}</td>
                <td>
                  <code>{product.traceability_code}</code>
                </td>
                <td>{getStatusBadge(product.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
