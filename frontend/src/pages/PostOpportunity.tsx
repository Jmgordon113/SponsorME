import React, { useState } from 'react';
import API from '../utils/axiosConfig'; // FIX: import from implementation, not .d.ts or .ts

interface SponsorshipLevel {
  level: string;
  amount: string;
  benefits: string;
}

const PostOpportunity: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tagline: '',
    description: '',
    sponsorshipLevels: [{ level: '', amount: '', benefits: '' }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof SponsorshipLevel
  ) => {
    const levels = [...formData.sponsorshipLevels];
    levels[index][field] = e.target.value;
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
      sponsorshipLevels: [...formData.sponsorshipLevels, { level: '', amount: '', benefits: '' }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        sponsorshipLevels: formData.sponsorshipLevels.map(lvl => ({
          ...lvl,
          amount: Number(lvl.amount),
        })),
      };
      await API.post('/api/opportunities', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Opportunity posted successfully!');
      setFormData({
        title: '',
        category: '',
        tagline: '',
        description: '',
        sponsorshipLevels: [{ level: '', amount: '', benefits: '' }],
      });
    } catch (err) {
      console.error(err);
      alert('Failed to post opportunity.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
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
              name="sponsorshipLevels.level"
              placeholder="Level Name (e.g., Bronze)"
              value={level.level}
              onChange={(e) => handleChange(e, index, 'level')}
              required
            />
            <input
              name="sponsorshipLevels.amount"
              placeholder="Amount"
              value={level.amount}
              onChange={(e) => handleChange(e, index, 'amount')}
              required
            />
            <input
              name="sponsorshipLevels.benefits"
              placeholder="Benefits"
              value={level.benefits}
              onChange={(e) => handleChange(e, index, 'benefits')}
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
