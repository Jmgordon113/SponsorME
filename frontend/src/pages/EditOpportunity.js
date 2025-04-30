import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sponsorshipLevels: [{ level: '', amount: '', benefits: '' }],
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          sponsorshipLevels: res.data.sponsorshipLevels,
          image: res.data.image || null,
        });
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError('Failed to load opportunity. Please try again later.');
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleChange = (e, index = null, field = null) => {
    if (index !== null) {
      const levels = [...formData.sponsorshipLevels];
      levels[index][field] = e.target.value;
      setFormData({ ...formData, sponsorshipLevels: levels });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('sponsorshipLevels', JSON.stringify(formData.sponsorshipLevels));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axios.put(`/api/opportunities/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Opportunity updated successfully!');
      navigate('/dashboard-sponsee');
    } catch (err) {
      console.error('Error updating opportunity:', err);
      setError('Failed to update opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edit Opportunity</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Sponsorship Levels:
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
        </label>
        <label>
          Image:
          <input type="file" onChange={handleFileChange} />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Opportunity'}
        </button>
      </form>
    </div>
  );
};

export default EditOpportunity;
