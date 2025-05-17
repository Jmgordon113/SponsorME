import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axiosConfig'; // Ensure this points to the actual implementation file, e.g., axiosConfig.ts or axiosConfig.js

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  sponsorshipLevels: { level: string; amount: number; benefits: string; sponsorId?: string }[];
  creator?: { _id: string; name: string }; // Optional, but backend may return organizer as string
  organizer?: string; // For backend response
}

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [note, setNote] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      API.get(`/api/opportunities/${id}`).then((res) => {
        setOpportunity(res.data);
      }).catch((err) => console.error('Failed to load opportunity', err));
    }
  }, [id]);

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity) return;
    const amount = opportunity.sponsorshipLevels.find(l => l.level === selectedLevel)?.amount;
    try {
      await API.post('/api/sponsorships', {
        opportunityId: opportunity._id,
        level: selectedLevel,
        amount,
        message: note,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sponsorship confirmed!');
    } catch (err) {
      alert('Failed to confirm sponsorship. Please try again.');
    }
  };

  const handleSponsorNow = async () => {
    if (!opportunity) return;
    try {
      await API.post('/api/messages', {
        receiverId: opportunity.creator?._id,
        text: `Hi, I'm interested in sponsoring "${opportunity.title}".`,
        opportunityId: opportunity._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/messages', { state: { selectedUserId: opportunity.creator?._id } });
    } catch (err) {
      alert('Failed to send message. Please try again.');
    }
  };

  if (!opportunity) return <p>Loading...</p>;

  return (
    <div>
      <h2>{opportunity.title}</h2>
      <p>{opportunity.description}</p>
      <p><strong>Organizer:</strong> {opportunity.organizer || (opportunity as any).sponseeId?.name || opportunity.creator?.name || ''}</p>

      <h4>Sponsorship Levels</h4>
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

      {role === 'sponsor' && (
        <>
          <form onSubmit={handleSponsorSubmit}>
            <label>Select Level:</label>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="">Select a level</option>
              {opportunity.sponsorshipLevels.map((level, idx) => (
                <option
                  key={idx}
                  value={level.level}
                  disabled={!!level.sponsorId}
                >
                  {level.level} - ${level.amount} {level.sponsorId ? '(Claimed)' : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Message"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit">Confirm Sponsorship</button>
          </form>
          <button onClick={handleSponsorNow}>Sponsor Now</button>
        </>
      )}
    </div>
  );
};

export default OpportunityDetail;
