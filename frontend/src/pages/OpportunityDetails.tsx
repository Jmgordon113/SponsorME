import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

interface SponsorshipLevel {
  level: string;
  amount: number;
  benefits: string;
}

interface Opportunity {
  _id: string;
  title: string;
  category: string;
  description: string;
  sponsorshipLevels: SponsorshipLevel[];
  sponseeId: { _id: string; name: string };
}

const OpportunityDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setOpportunity(res.data);
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError('Failed to load opportunity details.');
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleSponsorNow = async () => {
    try {
      await axios.post('/api/messages', {
        receiverId: opportunity?.sponseeId._id,
        text: `Hi, I'm interested in sponsoring your opportunity "${opportunity?.title}"`,
        opportunityId: opportunity?._id,
      });
      navigate('/messages', { state: { selectedUserId: opportunity?.sponseeId._id } });
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to contact the organizer. Please try again.');
    }
  };

  if (error) return <p className="error-msg">{error}</p>;
  if (!opportunity) return <p>Loading...</p>;

  return (
    <div className="opportunity-detail-container">
      <h1>{opportunity.title}</h1>
      <p><strong>Category:</strong> {opportunity.category}</p>
      <p><strong>Organized by:</strong> {opportunity.sponseeId.name}</p>
      <p>{opportunity.description}</p>

      <h3>Sponsorship Levels</h3>
      <ul>
        {opportunity.sponsorshipLevels.map((level, index) => (
          <li key={index}>
            <strong>{level.level}</strong>: ${level.amount} – {level.benefits}
          </li>
        ))}
      </ul>

      <button onClick={handleSponsorNow}>Sponsor Now</button>
    </div>
  );
};

export default OpportunityDetails;
