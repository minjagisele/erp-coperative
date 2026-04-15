import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Buyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await axios.get('/api/buyers');
      setBuyers(response.data);
    } catch (error) {
      console.error('Error fetching buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/buyers', formData);
      setFormData({ name: '', email: '', phone: '', company: '' });
      fetchBuyers();
    } catch (error) {
      console.error('Error creating buyer:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Gestion des Acheteurs</h1>
      
      <div className="form-container">
        <h2>Ajouter un acheteur</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom</label>
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
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Entreprise</label>
            <input
              type="text"
              className="form-control"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Ajouter l'acheteur
          </button>
        </form>
      </div>

      <div className="table-container">
        <h2>Liste des acheteurs</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Entreprise</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => (
              <tr key={buyer.id}>
                <td>{buyer.name}</td>
                <td>{buyer.email}</td>
                <td>{buyer.phone}</td>
                <td>{buyer.company}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Buyers;
