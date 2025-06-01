import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

function OpportunityDetail() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/opportunities/${id}`).then(res => setOpportunity(res.data));
  }, [id]);

  const handleSponsor = async e => {
    e.preventDefault();
    if (!selectedLevel) return;
    const level = opportunity.sponsorshipLevels.find(l => l.level === selectedLevel);
    await axios.post('/api/sponsorships', {
      opportunityId: opportunity._id,
      level: selectedLevel,
      amount: level.amount,
      message: note,
    });
    alert('Sponsorship confirmed!');
  };

  if (!opportunity) return <p>Loading...</p>;

  return (
    <div className="opportunity-detail-container">
      <h2 className="opportunity-title">{opportunity.title}</h2>
      <div className="opportunity-category">{opportunity.category}</div>
      <div className="opportunity-description">{opportunity.description}</div>
      <div className="sponsorship-levels">
        <h3>Sponsorship Levels</h3>
        <ul>
          {opportunity.sponsorshipLevels.map((level, idx) => (
            <li key={idx}>
              <strong>{level.level}</strong> - ${level.amount}
              <br />
              <em>{level.benefits}</em>
              {level.sponsorId && <span style={{ color: 'orange' }}> (Claimed)</span>}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSponsor}>
        <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
          <option value="">Select a level</option>
          {opportunity.sponsorshipLevels.map((level, idx) => (
            <option key={idx} value={level.level} disabled={!!level.sponsorId}>
              {level.level} - ${level.amount} {level.sponsorId ? '(Claimed)' : ''}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Message"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button type="submit" className="cta-btn">Sponsor Now</button>
      </form>
    </div>
  );
}

export default OpportunityDetail;
