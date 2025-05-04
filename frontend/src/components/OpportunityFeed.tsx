import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

interface Opportunity {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
}

const OpportunityFeed: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    </div>
  );
};

export default OpportunityFeed;
