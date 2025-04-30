import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

interface SponsorshipLevel {
  name: string;
  amount: number;
  sponsorId?: { name: string }; // Optional field to track sponsorship
}

interface Opportunity {
  _id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  sponsorshipLevels: SponsorshipLevel[];
  creator?: { name: string; _id: string }; // Optional if populated on the backend
  image?: string; // Optional field for opportunity image
}

const OpportunityDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setOpportunity(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load opportunity.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleSponsor = async (levelName: string) => {
    try {
      await axios.post('/api/sponsorships', {
        opportunityId: opportunity?._id,
        sponsorshipLevel: levelName,
      });
      alert('Sponsorship successful!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to sponsor.');
    }
  };

  const handleMessageOrganizer = async () => {
    try {
      await axios.post('/api/messages', {
        receiverId: opportunity?.creator?._id,
        text: 'Hi! I’m interested in sponsoring your opportunity.',
        opportunityId: opportunity?._id,
      });
      navigate('/messages');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !opportunity) return <div>{error || 'Opportunity not found.'}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      {opportunity.image && (
        <img
          src={opportunity.image}
          alt="Opportunity"
          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '1rem' }}
        />
      )}
      <h2>{opportunity.title}</h2>
      <h4>{opportunity.category} - {opportunity.tagline}</h4>
      <p>{opportunity.description}</p>

      <h3>Sponsorship Levels</h3>
      <ul>
        {opportunity.sponsorshipLevels.map((level, index) => (
          <li key={index}>
            {level.name}: ${level.amount}
            {level.sponsorId ? (
              <span>Sponsored by {level.sponsorId.name}</span>
            ) : (
              <button onClick={() => handleSponsor(level.name)}>Sponsor This Level</button>
            )}
          </li>
        ))}
      </ul>

      {opportunity.creator && (
        <p>Organized by: {opportunity.creator.name}</p>
      )}
      <button onClick={handleMessageOrganizer}>Message about this opportunity</button>
    </div>
  );
};

export default OpportunityDetails;
