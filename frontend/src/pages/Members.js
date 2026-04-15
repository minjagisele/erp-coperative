import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/members', formData);
      setFormData({ name: '', email: '', phone: '', address: '' });
      fetchMembers();
    } catch (error) {
      console.error('Error creating member:', error);
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
      <h1>Gestion des Adhérents</h1>
      
      <div className="form-container">
        <h2>Ajouter un adhérent</h2>
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
            <label className="form-label">Adresse</label>
            <textarea
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Ajouter l'adhérent
          </button>
        </form>
      </div>

      <div className="table-container">
        <h2>Liste des adhérents</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Date d'adhésion</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.address}</td>
                <td>{new Date(member.join_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;
