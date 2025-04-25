import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import './OpportunityFeed.css';
import { useNavigate } from 'react-router-dom';

const OpportunityFeed = () => {
  const [opportunities, setOpportunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get('/api/opportunities');
        setOpportunities(res.data || []);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setOpportunities([]);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="opportunity-feed-container">
      <h1 className="feed-header">Available Sponsorship Opportunities</h1>

      {/* Optional: Filter UI can be added here in the future */}

      <div className="opportunity-grid">
        {opportunities.length > 0 ? (
          opportunities.map((opp, index) => (
            <div className="opp-card" key={index}>
              <h3>{opp.title}</h3>
              <p className="category-tag">{opp.category}</p>
              <p className="description">{opp.tagline || opp.description?.substring(0, 100) + '...'}</p>
              <button onClick={() => navigate(`/opportunity/${opp._id}`)} className="view-btn">
                View Opportunity
              </button>
            </div>
          ))
        ) : (
          <p>No sponsorship opportunities available.</p>
        )}
      </div>
    </div>
  );
};

export default OpportunityFeed;
