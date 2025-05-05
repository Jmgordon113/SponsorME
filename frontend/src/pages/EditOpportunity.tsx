import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import './EditOpportunity.css';

interface SponsorshipLevel {
  level: string;
  amount: string;
  benefits: string;
}

const EditOpportunity: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    sponsorshipLevels: [{ level: '', amount: '', benefits: '' }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError('Failed to load opportunity details.');
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    field?: keyof SponsorshipLevel
  ) => {
    if (index !== undefined && field) {
      const levels = [...formData.sponsorshipLevels];
      levels[index][field as keyof SponsorshipLevel] = e.target.value;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.put(`/api/opportunities/${id}`, formData);
      navigate('/dashboard-sponsee');
    } catch (err) {
      console.error('Error updating opportunity:', err);
      setError('Failed to update opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-opportunity-container">
      <h2>Edit Opportunity</h2>
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
          + Add Level
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Update Opportunity'}
        </button>
      </form>
    </div>
  );
};

export default EditOpportunity;
