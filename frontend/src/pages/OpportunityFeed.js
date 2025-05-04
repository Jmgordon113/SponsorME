import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import './OpportunityFeed.css';

const OpportunityFeed = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

      {isLoading ? (
        <p>Loading opportunities...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : opportunities.length > 0 ? (
        <div className="opportunity-grid">
          {opportunities.map((opp) => (
            <Link to={`/opportunity/${opp._id}`} key={opp._id}>
              <div className="opp-card">
                {opp.image && (
                  <img
                    src={opp.image}
                    alt="Opportunity Thumbnail"
                    style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                  />
                )}
                <h3>{opp.title}</h3>
                <p className="category-tag">{opp.category}</p>
                <p className="description">
                  {opp.description.length > 100
                    ? `${opp.description.substring(0, 100)}...`
                    : opp.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No sponsorship opportunities available at the moment.</p>
      )}
    </div>
  );
};

export default OpportunityFeed;
