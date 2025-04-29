import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import './OpportunityDetail.css';
import { useParams, useNavigate } from 'react-router-dom';

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setOpportunity(res.data);
      } catch (err) {
        console.error('Error fetching opportunity:', err);
        setError('Failed to load opportunity. Please try again later.');
        navigate('/feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, navigate]);

  const handleSponsor = async () => {
    try {
      const response = await axios.post('/api/sponsorships', {
        opportunityId: opportunity._id,
        level: 'Gold', // Example level
        amount: 5000, // Example amount
        message: 'Excited to sponsor this opportunity!',
      });
      alert('Sponsorship successful!');
      console.log('Sponsorship response:', response.data);
    } catch (err) {
      console.error('Error sponsoring opportunity:', err);
      alert(err.response?.data?.error || 'Failed to sponsor opportunity');
    }
  };

  const handleMessageOrganizer = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/messages',
        {
          recipientId: opportunity.creator._id || null, // Use userId if available
          recipientEmail: opportunity.creator.email || null, // Fallback to email
          content: 'Hi! I’m interested in sponsoring your opportunity.',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/messages'); // Redirect to messaging screen
    } catch (err) {
      console.error('Failed to initiate message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  if (isLoading) {
    return <p>Loading opportunity...</p>;
  }

  if (error) {
    return <p className="error-msg">{error}</p>;
  }

  if (!opportunity) {
    return <p>Opportunity not found.</p>;
  }

  return (
    <div className="opportunity-detail-container">
      <h1 className="opportunity-title">{opportunity.title}</h1>
      <p className="opportunity-category">{opportunity.category}</p>
      <p className="opportunity-description">{opportunity.description}</p>

      <section className="sponsorship-levels">
        <h2>Sponsorship Packages</h2>
        {opportunity.sponsorshipLevels && opportunity.sponsorshipLevels.length > 0 ? (
          <ul>
            {opportunity.sponsorshipLevels.map((level, idx) => (
              <li key={idx}>
                <strong>{level.level}</strong> – ${level.amount}
                <p>{level.benefits}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No packages listed.</p>
        )}
      </section>

      <section className="organizer-section">
        <h3>Organizer</h3>
        <p>{opportunity.organizer || 'Organizer info coming soon'}</p>
      </section>

      <div className="cta-buttons">
        <button className="button secondary" onClick={handleSponsor}>
          Sponsor This Opportunity
        </button>
        <button className="button" onClick={handleMessageOrganizer}>
          Message Organizer
        </button>
      </div>
    </div>
  );
};

export default OpportunityDetail;
