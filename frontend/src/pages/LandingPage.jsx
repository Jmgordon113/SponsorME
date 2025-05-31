import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/opportunities').then(res => setOpportunities(res.data || []));
  }, []);

  const filtered = opportunities.filter(opp =>
    (!search || opp.title.toLowerCase().includes(search.toLowerCase())) &&
    (!category || opp.category === category)
  );

  return (
    <div className="opportunity-feed-container">
      <h1 className="feed-header">Available Sponsorship Opportunities</h1>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {[...new Set(opportunities.map(o => o.category))].map(cat => (
          <button
            key={cat}
            className={`filter-chip${category === cat ? ' active' : ''}`}
            onClick={() => setCategory(category === cat ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="opportunity-grid">
        {filtered.map(opp => (
          <div className="opp-card" key={opp._id} onClick={() => navigate(`/opportunity/${opp._id}`)}>
            {opp.image && <img src={opp.image} alt="" className="opp-thumbnail" />}
            <h3>{opp.title}</h3>
            <p className="category-tag">{opp.category}</p>
            <p className="description">{opp.description?.slice(0, 100)}...</p>
            <button className="sponsor-btn">Sponsor Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
