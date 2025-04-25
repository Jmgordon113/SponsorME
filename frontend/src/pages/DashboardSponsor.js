import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import './DashboardSponsor.css'; // Add this for layout styling
import { useNavigate } from 'react-router-dom'; // Corrected import statement

const DashboardSponsor = () => {
  const [userName, setUserName] = useState('Sponsor');
  const [sponsoredOpps, setSponsoredOpps] = useState([]);
  const [messages, setMessages] = useState([]);
  const [totalSponsored, setTotalSponsored] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserName(decoded.name || 'Sponsor');

        const [oppRes, msgRes, totalRes] = await Promise.all([
          axios.get('/api/opportunities/sponsorships/mine', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/messages/preview', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/sponsorships/totals', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setSponsoredOpps(oppRes.data || []);
        setMessages(msgRes.data || []);
        setTotalSponsored(totalRes.data?.total || 0);
      } catch (err) {
        console.error('Dashboard error:', err);
        setSponsoredOpps([]);
        setMessages([]);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <span className="sponsor">Sponsor</span><span className="me">Me</span>
        </div>
        <nav>
          <a className="active">Dashboard</a>
          <a href="/feed">Opportunities</a>
          <a href="/messages">Messages</a>
          <a href="/account">Manage</a>
        </nav>
      </aside>

      <main className="main">
        <h1 className="dashboard-header">Sponsor Dashboard | Welcome, {userName}</h1>

        <div className="metrics">
          <div className="metric-box">
            <p>Opportunities</p>
            <h2>{sponsoredOpps?.length || 0}</h2> {/* Handle missing data */}
          </div>
          <div className="metric-box">
            <p>Messages</p>
            <h2>{messages?.length || 0}</h2> {/* Handle missing data */}
          </div>
          <div className="metric-box">
            <p>Total Sponsored</p>
            <h2>${totalSponsored?.toLocaleString() || 0}</h2> {/* Handle missing data */}
          </div>
        </div>

        <div className="section">
          <h3>Opportunities</h3>
          <button className="button" onClick={() => navigate('/feed')}>Filter Opportunities</button>
          <div className="card-list">
            {sponsoredOpps?.length > 0 ? (
              sponsoredOpps.map((opp, idx) => (
                <div className="card" key={idx}>
                  <div>
                    <strong>{opp.title || 'Opportunity Title'}</strong>
                    <p>{opp.description || 'Short description of the opportunity.'}</p>
                  </div>
                  <button className="button" onClick={() => navigate(`/opportunity/${opp._id}`)}>View</button>
                </div>
              ))
            ) : (
              <p>No sponsored opportunities found.</p>
            )}
          </div>
        </div>

        <div className="section">
          <h3>Messages</h3>
          <div className="card-list">
            {messages?.length > 0 ? (
              messages.map((msg, idx) => (
                <div className="card" key={idx}>
                  <div>
                    <strong>{msg.senderName || 'Sponsee Name'}</strong>
                    <p>{msg.snippet || 'Message snippet goes here.'}</p>
                  </div>
                  <span style={{ color: '#aaa' }}>{msg.timestamp || '2h ago'}</span>
                </div>
              ))
            ) : (
              <p>No recent messages.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSponsor;
