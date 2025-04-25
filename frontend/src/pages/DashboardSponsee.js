import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Use the configured axios instance
import './DashboardSponsee.css';
import { useNavigate } from 'react-router-dom';

const DashboardSponsee = () => {
  const [userName, setUserName] = useState('Sponsee');
  const [opportunities, setOpportunities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserName(decoded.name || 'Sponsee');

        const [oppsRes, msgRes, totalRes] = await Promise.all([
          axios.get('/api/opportunities/mine', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/messages/preview', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/sponsorships/totals', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setOpportunities(oppsRes.data || []);
        setMessages(msgRes.data || []);
        setTotalRaised(totalRes.data?.total || 0);
      } catch (err) {
        console.error('Dashboard load error:', err);
        setOpportunities([]);
        setMessages([]);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="sponsor">Sponsor</span><span className="me">Me</span>
        </div>
        <nav>
          <a className="active">Dashboard</a>
          <a href="/opportunities">My Opportunities</a>
          <a href="/messages">Messages</a>
          <a href="/account">Manage</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <h1 className="dashboard-header">Sponsee Dashboard | Welcome, {userName}</h1>

        <div className="metrics">
          <div className="metric-box">
            <p>Opportunities Posted</p>
            <h2>{opportunities.length}</h2>
          </div>
          <div className="metric-box">
            <p>Messages</p>
            <h2>{messages.length}</h2>
          </div>
          <div className="metric-box">
            <p>Total Raised</p>
            <h2>${totalRaised.toLocaleString()}</h2>
          </div>
          <div className="metric-box">
            <p>Actions</p>
            <button className="button" onClick={() => navigate('/opportunities/new')}>
              + Add New Opportunity
            </button>
          </div>
        </div>

        <div className="section">
          <h3>My Opportunities</h3>
          <div className="card-list">
            {opportunities.length > 0 ? (
              opportunities.map((opp, idx) => (
                <div className="card" key={idx}>
                  <div>
                    <strong>{opp.title || 'Opportunity Title'}</strong>
                    <p>{opp.description || 'Short description of your opportunity.'}</p>
                  </div>
                  <button className="button" onClick={() => navigate(`/opportunity/${opp._id}`)}>View</button>
                </div>
              ))
            ) : (
              <p>No opportunities posted yet.</p>
            )}
          </div>
        </div>

        <div className="section">
          <h3>Messages</h3>
          <div className="card-list">
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div className="card" key={idx}>
                  <div>
                    <strong>{msg.senderName || 'Sponsor Name'}</strong>
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

export default DashboardSponsee;
