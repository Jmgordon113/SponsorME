import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import axios from '../utils/axiosConfig'; // ✅ Use the configured axios instance

interface SponsorshipLevel {
  name: string;
  amount: number;
}

interface Opportunity {
  _id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  sponsorshipLevels: SponsorshipLevel[];
}

const OpportunityFeed: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await axios.get('/api/opportunities'); // Use axiosConfig for baseURL
        setOpportunities(res.data);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return <div>Loading opportunities...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Available Sponsorship Opportunities</h2>
      {opportunities.length === 0 ? (
        <p>No opportunities found.</p>
      ) : (
        opportunities.map((opp) => (
          <div key={opp._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <h3>{opp.title}</h3>
            <h4>{opp.category} - {opp.tagline}</h4>
            <p>{opp.description}</p>
            <Link to={`/opportunities/${opp._id}`}>View Details</Link> {/* Add Link */}
          </div>
        ))
      )}
    </div>
  );
};

export default OpportunityFeed;
