import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

function SponseeDashboard() {
  const [userName, setUserName] = useState('Sponsee');
  const [opportunities, setOpportunities] = useState([]);
  const [totalSponsored, setTotalSponsored] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    setUserName(localStorage.getItem('name') || 'Sponsee');
    axios.get('/api/opportunities/mine').then(res => setOpportunities(res.data || []));
    axios.get('/api/sponsorships/totals').then(res => setTotalSponsored(res.data.total || 0));
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Sponsee Dashboard | Welcome, {userName}</h1>
      <div className="summary-cards">
        <div className="card">
          <h2>Total Sponsored</h2>
          <p>💰 ${totalSponsored.toLocaleString()}</p>
        </div>
        <div className="card">
          <h2>Active Opportunities</h2>
          <p>📋 {opportunities.length}</p>
        </div>
      </div>
      <div className="opportunity-list">
        {opportunities.map(opp => (
          <div className="opportunity-card" key={opp._id}>
            <h3>{opp.title}</h3>
            <p>{opp.category}</p>
            <button className="cta-btn" onClick={() => navigate(`/opportunity/edit/${opp._id}`)}>
              Edit
            </button>
          </div>
        ))}
      </div>
      <button className="cta-btn" onClick={() => navigate('/add-opportunity')}>
        Create New Opportunity
      </button>
    </div>
  );
}

export default SponseeDashboard;
