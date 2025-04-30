import React, { useState } from 'react';
import axios from '../utils/axiosConfig'; // Use the configured axios instance

const PostOpportunity: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tagline: '',
    description: '',
    sponsorshipLevels: [{ name: '', amount: '' }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;

    if (name.startsWith('sponsorshipLevels') && index !== undefined) {
      const levels = [...formData.sponsorshipLevels];
      levels[index][name.split('.')[1]] = value;
      setFormData({ ...formData, sponsorshipLevels: levels });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddLevel = () => {
    setFormData({
      ...formData,
      sponsorshipLevels: [...formData.sponsorshipLevels, { name: '', amount: '' }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = process.env.REACT_APP_TEST_TOKEN; // Use the TEST token from your .env
      const res = await axios.post('/api/opportunities', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Opportunity posted successfully!');
      console.log(res.data);
      // Reset form
      setFormData({
        title: '',
        category: '',
        tagline: '',
        description: '',
        sponsorshipLevels: [{ name: '', amount: '' }],
      });
    } catch (err) {
      console.error(err);
      alert('Failed to post opportunity.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Post a New Opportunity</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="tagline"
          placeholder="Tagline"
          value={formData.tagline}
          onChange={handleChange}
          required
        /><br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        /><br /><br />

        <h4>Sponsorship Levels</h4>
        {formData.sponsorshipLevels.map((level, index) => (
          <div key={index}>
            <input
              name="sponsorshipLevels.name"
              placeholder="Level Name (e.g., Bronze)"
              value={level.name}
              onChange={(e) => handleChange(e, index)}
              required
            />
            <input
              name="sponsorshipLevels.amount"
              placeholder="Amount"
              value={level.amount}
              onChange={(e) => handleChange(e, index)}
              required
            />
            <br /><br />
          </div>
        ))}
        <button type="button" onClick={handleAddLevel}>
          + Add Sponsorship Level
        </button>
        <br /><br />

        <button type="submit">Submit Opportunity</button>
      </form>
    </div>
  );
};

export default PostOpportunity;
