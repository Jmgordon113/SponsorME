import React, { useState } from 'react';
import API from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './CreateOpportunity.css';

function CreateOpportunity() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tagline: '',
    description: '',
    sponsorshipLevels: [{ level: '', amount: '', benefits: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e, index, field) => {
    if (typeof index === 'number' && field) {
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
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        sponsorshipLevels: formData.sponsorshipLevels.map(lvl => ({
          ...lvl,
          amount: Number(lvl.amount),
        })),
      };
      await API.post('/api/opportunities', payload);
      navigate('/dashboard-sponsee');
    } catch (err) {
      console.error('Error creating opportunity:', err);
      setError('Failed to create opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-opportunity-container">
      <h2>Create New Opportunity</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </label>
        <label>
          Tagline:
          <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <h4>Sponsorship Levels</h4>
        {formData.sponsorshipLevels.map((level, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Level Name"
              value={level.level}
              onChange={e => handleChange(e, index, 'level')}
            />
            <input
              type="number"
              placeholder="Amount"
              value={level.amount}
              onChange={e => handleChange(e, index, 'amount')}
            />
            <input
              type="text"
              placeholder="Benefits"
              value={level.benefits}
              onChange={e => handleChange(e, index, 'benefits')}
            />
          </div>
        ))}
        <button type="button" onClick={addSponsorshipLevel}>
          + Add Level
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Opportunity'}
        </button>
      </form>
    </div>
  );
}

export default CreateOpportunity;
