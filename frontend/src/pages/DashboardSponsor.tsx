import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import './DashboardSponsor.css';
import { useNavigate, Link } from 'react-router-dom';
import OpportunityList from '../components/OpportunityList';
import MessagePreview from '../components/MessagePreview';
import LogoutButton from '../components/LogoutButton';

const DashboardSponsor: React.FC = () => {
  const [userName, setUserName] = useState<string>('Sponsor');
  const [sponsoredOpps, setSponsoredOpps] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [totalSponsored, setTotalSponsored] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ opportunities: string; messages: string; totals: string }>({
    opportunities: '',
    messages: '',
    totals: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserName(decoded.name || 'Sponsor');

        const [oppRes, msgRes, totalRes] = await Promise.allSettled([
          axios.get('/api/opportunities/sponsorships/mine'),
          axios.get('/api/messages/preview'),
          axios.get('/api/sponsorships/totals'),
        ]);

        if (oppRes.status === 'fulfilled') {
          setSponsoredOpps(oppRes.value.data || []);
        } else {
          setError((prev) => ({ ...prev, opportunities: 'Could not load opportunities. Try again later.' }));
        }

        if (msgRes.status === 'fulfilled') {
          setMessages(msgRes.value.data || []);
        } else {
          setError((prev) => ({ ...prev, messages: 'Could not load messages. Try again later.' }));
        }

        if (totalRes.status === 'fulfilled') {
          setTotalSponsored(totalRes.value.data?.total || 0);
        } else {
          setError((prev) => ({ ...prev, totals: 'Could not load sponsorship totals. Try again later.' }));
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <span className="sponsor">Sponsor</span>
          <span className="me">Me</span>
        </div>
        <nav>
          <Link className="active" to="/dashboard-sponsor">Dashboard</Link>
          <Link to="/feed">Opportunities</Link>
          <Link to="/messages">Messages</Link>
          <Link to="/account">Manage</Link>
        </nav>
      </aside>

      <main className="main">
        <div className="dashboard-header-container">
          <h1 className="dashboard-header">Sponsor Dashboard | Welcome, {userName}</h1>
          <LogoutButton />
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="summary-cards">
              <div className="card">
                <h2>Total Sponsored</h2>
                <p>💰 ${totalSponsored.toLocaleString()}</p>
                {error.totals && <p className="error-message">{error.totals}</p>}
              </div>
              <div className="card">
                <h2>Opportunities Sponsored</h2>
                <p>📋 {sponsoredOpps.length}</p>
                {error.opportunities && <p className="error-message">{error.opportunities}</p>}
              </div>
            </div>

            <div className="section">
              <h3>Opportunities</h3>
              <OpportunityList opportunities={sponsoredOpps} error={error.opportunities} isSponsor={true} />
              <button className="cta-button" onClick={() => navigate('/feed')}>
                Browse More Opportunities
              </button>
            </div>

            <div className="section">
              <h3>Messages</h3>
              <MessagePreview messages={messages} error={error.messages} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardSponsor;
