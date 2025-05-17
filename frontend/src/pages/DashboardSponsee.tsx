import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import './DashboardSponsee.css';
import { useNavigate, Link } from 'react-router-dom';
import OpportunityList from '../components/OpportunityList';
import LogoutButton from '../components/LogoutButton';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  value: number;
  [key: string]: any;
}

const DashboardSponsee: React.FC = () => {
  const [userName, setUserName] = useState<string>('Sponsee');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [totalSponsored, setTotalSponsored] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ opportunities: string; totals: string }>({
    opportunities: '',
    totals: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const storedName = localStorage.getItem('name');
        setUserName(storedName || 'Sponsee');

        const [oppRes, totalRes] = await Promise.allSettled([
          axios.get('/api/opportunities/mine'),
          axios.get('/api/sponsorships/totals'),
        ]);

        if (oppRes.status === 'fulfilled') {
          setOpportunities(oppRes.value.data || []);
        } else {
          setError((prev) => ({
            ...prev,
            opportunities: 'Could not load opportunities. Try again later.',
          }));
        }

        if (totalRes.status === 'fulfilled') {
          setTotalSponsored(totalRes.value.data?.total || 0);
        } else {
          setError((prev) => ({
            ...prev,
            totals: 'Could not load sponsorship totals. Try again later.',
          }));
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
          <Link className="active" to="/dashboard-sponsee">Dashboard</Link>
          <Link to="/create">Create Opportunity</Link>
          <Link to="/account">Manage</Link>
        </nav>
      </aside>

      <main className="main">
        <div className="dashboard-header-container">
          <h1 className="dashboard-header">Sponsee Dashboard | Welcome, {userName}</h1>
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
                <h2>Active Opportunities</h2>
                <p>📋 {opportunities.length}</p>
                {error.opportunities && <p className="error-message">{error.opportunities}</p>}
              </div>
            </div>

            <div className="section">
              <h3>Your Opportunities</h3>
              <OpportunityList
                opportunities={opportunities}
                error={error.opportunities}
                isSponsor={false}
              />
              <button className="cta-button" onClick={() => navigate('/create')}>
                Create New Opportunity
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardSponsee;