import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setOpportunity(res.data);
      } catch (err) {
        console.error(err);
        setError('Could not load opportunity details.');
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleSponsorNow = async () => {
    try {
      await axios.post('/api/messages', {
        receiverId: opportunity.sponseeId._id, // Ensure sponseeId is populated in the backend response
        text: `Hi, I'm interested in sponsoring your opportunity "${opportunity.title}"`,
        opportunityId: opportunity._id,
      });
      navigate('/messages', { state: { selectedUserId: opportunity.sponseeId._id } }); // Pass sponseeId to Messages page
    } catch (err) {
      console.error('Failed to contact the organizer:', err);
      alert('Failed to contact the organizer. Please try again.');
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!opportunity) return <div>Loading...</div>;

  return (
    <div className="opportunity-detail">
      <h1>{opportunity.title}</h1>
      <p><strong>Category:</strong> {opportunity.category}</p>
      <p><strong>Organized by:</strong> {opportunity.sponseeId?.name || 'Unknown'}</p>
      <p>{opportunity.description}</p>

      <h3>Sponsorship Levels</h3>
      {opportunity.sponsorshipLevels && opportunity.sponsorshipLevels.length > 0 ? (
        <ul>
          {opportunity.sponsorshipLevels.map((level, index) => (
            <li key={index}>
              <strong>{level.level}</strong>: ${level.amount} – {level.benefits}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sponsorship levels defined.</p>
      )}

      <button className="sponsor-now-btn" onClick={handleSponsorNow}>
        Sponsor Now
      </button>
    </div>
  );
}

export default OpportunityDetail;
