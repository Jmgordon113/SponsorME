import React, { useState } from 'react';
import axios from '../axiosConfig';
import './CreateOpportunity.css';
import { useNavigate } from 'react-router-dom';

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    sponsorshipLevels: [{ level: '', amount: '', benefits: '' }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
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
      sponsorshipLevels: [
        ...formData.sponsorshipLevels,
        { level: '', amount: '', benefits: '' },
      ],
    });
  };

  const isFormValid = () => {
    const { title, category, sponsorshipLevels } = formData;
    return (
      title.trim() !== '' &&
      category.trim() !== '' &&
      sponsorshipLevels.some(
        (level) => level.level && level.amount && level.benefits
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/opportunities', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Opportunity created successfully!');
      setTimeout(() => navigate('/dashboard-sponsee'), 1500);
    } catch (err) {
      console.error('Error creating opportunity:', err);
      setError('Failed to create opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-opportunity-container">
      <h2>Create New Sponsorship Opportunity</h2>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="opportunity-form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <h4>Sponsorship Levels</h4>
        {formData.sponsorshipLevels.map((level, index) => (
          <div key={index} className="sponsorship-level">
            <input
              type="text"
              placeholder="Level Name"
              value={level.level}
              onChange={(e) => handleChange(e, index, 'level')}
            />
            <input
              type="number"
              placeholder="Amount"
              value={level.amount}
              onChange={(e) => handleChange(e, index, 'amount')}
            />
            <input
              type="text"
              placeholder="Benefits"
              value={level.benefits}
              onChange={(e) => handleChange(e, index, 'benefits')}
            />
          </div>
        ))}

        <button type="button" onClick={addSponsorshipLevel}>
          + Add Sponsorship Level
        </button>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Opportunity'}
        </button>
      </form>
    </div>
  );
};

export default CreateOpportunity;
