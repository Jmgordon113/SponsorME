import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  sponsorshipLevels: { name: string; amount: number }[];
  creator: { _id: string; name: string };
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
      axios.get(`/api/opportunities/${id}`).then((res) => {
        setOpportunity(res.data);
      }).catch((err) => console.error('Failed to load opportunity', err));
    }
  }, [id]);

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity) return;
    const amount = opportunity.sponsorshipLevels.find(l => l.name === selectedLevel)?.amount;
    await axios.post('/api/sponsorships', {
      opportunityId: opportunity._id,
      level: selectedLevel,
      amount,
      message: note,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Sponsorship confirmed!');
  };

  const handleSponsorNow = async () => {
    if (!opportunity) return;
    await axios.post('/api/messages', {
      receiverId: opportunity.creator._id,
      text: `Hi, I'm interested in sponsoring "${opportunity.title}".`,
      opportunityId: opportunity._id,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/messages', { state: { selectedUserId: opportunity.creator._id } });
  };

  if (!opportunity) return <p>Loading...</p>;

  return (
    <div>
      <h2>{opportunity.title}</h2>
      <p>{opportunity.description}</p>
      <p><strong>Organizer:</strong> {opportunity.creator.name}</p>

      {role === 'sponsor' && (
        <>
          <form onSubmit={handleSponsorSubmit}>
            <label>Select Level:</label>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              {opportunity.sponsorshipLevels.map((level, idx) => (
                <option key={idx} value={level.name}>{level.name} - ${level.amount}</option>
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
