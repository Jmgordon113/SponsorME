import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/axiosConfig';
import './OpportunityFeed.css';

// Define the Opportunity interface
const OpportunityFeed = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await API.get('/api/opportunities');
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

  // Filtering logic
  const filtered = opportunities.filter((opp) => {
    let pass = true;
    if (category && opp.category !== category) pass = false;
    if (minAmount) {
      const min = parseFloat(minAmount);
      if (!opp.sponsorshipLevels.some(l => l.amount >= min)) pass = false;
    }
    if (maxAmount) {
      const max = parseFloat(maxAmount);
      if (!opp.sponsorshipLevels.some(l => l.amount <= max)) pass = false;
    }
    return pass;
  });

  return (
    <div className="opportunity-feed-container">
      <h1 className="feed-header">Available Sponsorship Opportunities</h1>
      <div style={{ marginBottom: '1rem' }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {[...new Set(opportunities.map(o => o.category))].map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={e => setMinAmount(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={e => setMaxAmount(e.target.value)}
          style={{ marginLeft: 8 }}
        />
      </div>
      {isLoading ? (
        <p>Loading opportunities...</p> // Placeholder for loading
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : filtered.length > 0 ? (
        <div className="opportunity-grid">
          {filtered.map((opp) => (
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
