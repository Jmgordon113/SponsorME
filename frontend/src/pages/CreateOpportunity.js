import React, { useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import './CreateOpportunity.css';
import { useNavigate } from 'react-router-dom';

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    sponsorshipLevels: [{ level: '', amount: '', benefits: '' }],
  });

  const navigate = useNavigate();

  const handleChange = (e, index = null, field = null) => {
    if (index !== null) {
      const levels = [...formData.sponsorshipLevels];
      levels[index][field] = e.target.value;
      setFormData({ ...formData, sponsorshipLevels: levels });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addSponsorshipLevel = () => {
    setFormData({
      ...formData,
      sponsorshipLevels: [...formData.sponsorshipLevels, { level: '', amount: '', benefits: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/opportunities', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard-sponsee');
    } catch (err) {
      console.error('Error creating opportunity:', err);
    }
  };

  return (
    <div className="create-opportunity-container">
      <h2>Create New Sponsorship Opportunity</h2>
      <form onSubmit={handleSubmit} className="opportunity-form">
        <input
          type="text"
          name="title"
          placeholder="Opportunity Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Environment, Education)"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Describe your opportunity"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <h4>Sponsorship Levels</h4>
        {formData.sponsorshipLevels.map((level, index) => (
          <div key={index} className="sponsorship-level">
            <input
              type="text"
              placeholder="Level Name (e.g., Gold)"
              value={level.level}
              onChange={(e) => handleChange(e, index, 'level')}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={level.amount}
              onChange={(e) => handleChange(e, index, 'amount')}
              required
            />
            <input
              type="text"
              placeholder="Benefits"
              value={level.benefits}
              onChange={(e) => handleChange(e, index, 'benefits')}
              required
            />
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addSponsorshipLevel}>+ Add Another Level</button>
        <button type="submit" className="submit-btn">Publish Opportunity</button>
      </form>
    </div>
  );
};

export default CreateOpportunity;
