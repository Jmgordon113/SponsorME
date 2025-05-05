import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import './OpportunityFeed.css';

// Define the Opportunity interface
interface Opportunity {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string; // Optional field
}

const OpportunityFeed: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]); // Typed state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Explicit typing

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get<Opportunity[]>('/api/opportunities'); // Typed API response
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
        <p>Loading opportunities...</p> // Placeholder for loading
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
                    className="opp-thumbnail" // Moved styles to CSS
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
