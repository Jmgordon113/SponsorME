import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import './DashboardSponsee.css';
import { useNavigate } from 'react-router-dom';
import OpportunityList from '../components/OpportunityList';
import MessagePreview from '../components/MessagePreview';
import LogoutButton from '../components/LogoutButton'; // Import LogoutButton

const DashboardSponsee = () => {
  const [userName, setUserName] = useState('');
  const [totalRaised, setTotalRaised] = useState(0);
  const [postedOpportunities, setPostedOpportunities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ opportunities: '', messages: '', totals: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserName(decoded.name || 'Sponsee');

        const [oppsRes, msgRes, totalRes] = await Promise.allSettled([
          axios.get('/api/opportunities/mine', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/messages/preview', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/sponsorships/totals', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (oppsRes.status === 'fulfilled') {
          setPostedOpportunities(oppsRes.value.data || []);
        } else {
          setError((prev) => ({ ...prev, opportunities: 'Could not load opportunities. Try again later.' }));
        }

        if (msgRes.status === 'fulfilled') {
          setMessages(msgRes.value.data || []);
        } else {
          setError((prev) => ({ ...prev, messages: 'Could not load messages. Try again later.' }));
        }

        if (totalRes.status === 'fulfilled') {
          setTotalRaised(totalRes.value.data?.total || 0);
        } else {
          setError((prev) => ({ ...prev, totals: 'Could not load sponsorship totals. Try again later.' }));
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard-sponsee">
      <div className="dashboard-header-container">
        <h1>Welcome, {userName}! 🌟</h1>
        <LogoutButton /> {/* Add LogoutButton */}
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="summary-cards">
            <div className="card">
              <h2>Total Raised</h2>
              <p>💵 ${totalRaised.toLocaleString()}</p>
              {error.totals && <p className="error-message">{error.totals}</p>}
            </div>
            <div className="card">
              <h2>Opportunities Posted</h2>
              <p>📋 {postedOpportunities.length}</p>
              {error.opportunities && <p className="error-message">{error.opportunities}</p>}
            </div>
          </div>

          <div className="section">
            <h3>Your Posted Opportunities</h3>
            <OpportunityList opportunities={postedOpportunities} error={error.opportunities} isSponsor={false} />
            <button className="cta-button" onClick={() => navigate('/create')}>
              Create New Opportunity
            </button>
          </div>

          <div className="section">
            <h3>Messages</h3>
            <MessagePreview messages={messages} error={error.messages} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardSponsee;
