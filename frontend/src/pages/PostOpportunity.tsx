import React, { useState } from 'react';
import axios from '../utils/axiosConfig'; // Use the configured axios instance

interface SponsorshipLevel {
  name: string;
  amount: string;
}

const PostOpportunity: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tagline: '',
    description: '',
    sponsorshipLevels: [{ name: '', amount: '' }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof SponsorshipLevel
  ) => {
    const levels = [...formData.sponsorshipLevels];
    levels[index][field] = e.target.value as string; // Ensure type safety
    setFormData({ ...formData, sponsorshipLevels: levels });
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          // Removed misplaced onChange handler
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleFieldChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleFieldChange}
          required
        />
        <input
          name="tagline"
          placeholder="Tagline"
          value={formData.tagline}
          onChange={handleFieldChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleFieldChange}
          required
        ></textarea>
        <br /><br />

        <h4>Sponsorship Levels</h4>
        {formData.sponsorshipLevels.map((level, index) => (
          <div key={index}>
            <input
              name="sponsorshipLevels.name"
              placeholder="Level Name (e.g., Bronze)"
              value={level.name}
              onChange={(e) => handleChange(e, index, 'name')}
              required
            />
            <input
              name="sponsorshipLevels.amount"
              placeholder="Amount"
              value={level.amount}
              onChange={(e) => handleChange(e, index, 'amount')}
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
