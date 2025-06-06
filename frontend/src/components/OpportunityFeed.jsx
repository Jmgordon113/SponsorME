import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/axiosConfig';
import './OpportunityFeed.css';

function OpportunityFeed() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await API.get('/api/opportunities');
        setOpportunities(res.data || []);
      } catch (err) {
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  if (isLoading) return <p>Loading opportunities...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="opportunity-feed-container">
      <h1 className="feed-header">Available Sponsorship Opportunities</h1>
      <div className="opportunity-grid">
        {opportunities.map((opp) => (
          <Link to={`/opportunity/${opp._id}`} key={opp._id}>
            <div className="opp-card">
              {opp.image && (
                <img
                  src={opp.image}
                  alt="Opportunity Thumbnail"
                  className="opp-thumbnail"
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
    </div>
  );
}

export default OpportunityFeed;
