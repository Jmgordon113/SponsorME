import React, { useEffect, useState } from 'react';
import API from '../utils/axiosConfig';
import { Link } from 'react-router-dom';
import './Feed.css';

interface Opportunity {
  _id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  sponsorshipLevels: { level: string; amount: number; benefits: string }[];
}

const Feed: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await API.get<Opportunity[]>('/api/opportunities');
        setOpportunities(res.data);
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="feed-container">
      <h1>Opportunity Feed</h1>
      <div className="opportunity-list">
        {opportunities.map((opp) => (
          <div key={opp._id} className="opportunity-card">
            <h2>{opp.title}</h2>
            <p>{opp.tagline}</p>
            <p>{opp.category}</p>
            <Link to={`/opportunity/${opp._id}`} className="view-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;