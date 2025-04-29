import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import './OpportunityFeed.css';
import { useNavigate } from 'react-router-dom';

const OpportunityFeed = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get('/api/opportunities');
        setOpportunities(res.data || []);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="opportunity-feed-container">
      <h1 className="feed-header">Available Sponsorship Opportunities</h1>

      {/* Placeholder for future filter */}
      {/* <div className="filter-section">
        <select>
          <option value="">All Categories</option>
          <option value="Sports">Sports</option>
          <option value="Arts">Arts</option>
          <option value="Education">Education</option>
        </select>
      </div> */}

      {isLoading ? (
        <p>Loading opportunities...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : opportunities.length > 0 ? (
        <div className="opportunity-grid">
          {opportunities.map((opp, index) => (
            <div className="opp-card" key={index}>
              <h3>{opp.title}</h3>
              <p className="category-tag">{opp.category}</p>
              <p className="description">
                {opp.tagline || (opp.description?.length > 100
                  ? opp.description.substring(0, 100) + '...'
                  : opp.description)}
              </p>
              <button onClick={() => navigate(`/opportunity/${opp._id}`)} className="view-btn">
                View Opportunity
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No sponsorship opportunities available at the moment.</p>
      )}
    </div>
  );
};

export default OpportunityFeed;
