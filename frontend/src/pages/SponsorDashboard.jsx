import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function SponsorDashboard() {
  const [userName, setUserName] = useState('Sponsor');
  const [sponsoredOpps, setSponsoredOpps] = useState([]);
  const [totalSponsored, setTotalSponsored] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    setUserName(decoded.name || 'Sponsor');
    axios.get('/api/opportunities/sponsorships/mine').then(res => setSponsoredOpps(res.data || []));
    axios.get('/api/sponsorships/totals').then(res => setTotalSponsored(res.data.total || 0));
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Sponsor Dashboard | Welcome, {userName}</h1>
      <div className="summary-cards">
        <div className="card">
          <h2>Total Sponsored</h2>
          <p>💰 ${totalSponsored.toLocaleString()}</p>
        </div>
        <div className="card">
          <h2>Opportunities Sponsored</h2>
          <p>📋 {sponsoredOpps.length}</p>
        </div>
      </div>
      <div className="opportunity-list">
        {sponsoredOpps.map(opp => (
          <div className="opportunity-card" key={opp._id}>
            <h3>{opp.title}</h3>
            <p>{opp.category}</p>
            <button className="cta-btn" onClick={() => navigate(`/opportunity/${opp._id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SponsorDashboard;
