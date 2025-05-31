import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function AddOpportunity() {
  const [form, setForm] = useState({
    title: '', category: '', tagline: '', description: '',
    sponsorshipLevels: [{ level: '', amount: '', benefits: '' }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, idx, field) => {
    if (typeof idx === 'number') {
      const levels = [...form.sponsorshipLevels];
      levels[idx][field] = e.target.value;
      setForm({ ...form, sponsorshipLevels: levels });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addLevel = () => {
    setForm({
      ...form,
      sponsorshipLevels: [...form.sponsorshipLevels, { level: '', amount: '', benefits: '' }]
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    await axios.post('/api/opportunities', {
      ...form,
      sponsorshipLevels: form.sponsorshipLevels.map(lvl => ({ ...lvl, amount: Number(lvl.amount) }))
    });
    setIsSubmitting(false);
    navigate('/dashboard-sponsee');
  };

  return (
    <div className="create-opportunity-container">
      <h2>Create New Opportunity</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input name="tagline" placeholder="Tagline" value={form.tagline} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <h4>Sponsorship Levels</h4>
        {form.sponsorshipLevels.map((level, idx) => (
          <div key={idx}>
            <input placeholder="Level Name" value={level.level} onChange={e => handleChange(e, idx, 'level')} />
            <input placeholder="Amount" type="number" value={level.amount} onChange={e => handleChange(e, idx, 'amount')} />
            <input placeholder="Benefits" value={level.benefits} onChange={e => handleChange(e, idx, 'benefits')} />
          </div>
        ))}
        <button type="button" onClick={addLevel}>+ Add Level</button>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Create Opportunity'}</button>
      </form>
    </div>
  );
}

export default AddOpportunity;
