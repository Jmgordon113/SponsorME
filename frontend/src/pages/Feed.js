import React, { useEffect, useState } from 'react';
import API from '../utils/axiosConfig'; // Use the configured Axios instance

const Feed = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await API.get('/api/opportunities'); // Use API instance
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div>
      <h1>Opportunities</h1>
      {opportunities.map((opp) => (
        <div key={opp._id}>
          <h3>{opp.title}</h3>
          <p>{opp.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Feed;
