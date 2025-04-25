import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('/api/opportunities');
        setOpportunities(response.data);
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
      }
    };
    fetchOpportunities();
  }, []);

  return (
    <div className="feed">
      <h1>Opportunity Feed</h1>
      <ul>
        {opportunities.map((opp) => (
          <li key={opp._id}>
            <h2>{opp.title}</h2>
            <p>{opp.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;
