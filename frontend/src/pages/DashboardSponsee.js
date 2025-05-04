import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import './DashboardSponsee.css';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // Import LogoutButton

const DashboardSponsee = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user ID
        const userId = decoded.id;

        const res = await axios.get(`/api/opportunities?sponseeId=${userId}`);
        setOpportunities(res.data || []);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Failed to load opportunities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      await axios.delete(`/api/opportunities/${id}`);
      setOpportunities(opportunities.filter((opp) => opp._id !== id));
    } catch (err) {
      console.error('Error deleting opportunity:', err);
      alert('Failed to delete opportunity. Please try again.');
    }
  };

  return (
    <div className="dashboard-sponsee">
      <div className="dashboard-header-container">
        <h1>Your Opportunities</h1>
        <LogoutButton /> {/* Add LogoutButton */}
        <button className="cta-button" onClick={() => navigate('/create')}>
          + Add New Opportunity
        </button>
      </div>

      {isLoading ? (
        <p>Loading your opportunities...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : opportunities.length > 0 ? (
        <div className="opportunity-list">
          {opportunities.map((opp) => (
            <div className="opportunity-card" key={opp._id}>
              <h3>{opp.title}</h3>
              <p><strong>Category:</strong> {opp.category}</p>
              <p><strong>Created At:</strong> {new Date(opp.createdAt).toLocaleDateString()}</p>
              <div className="opportunity-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/opportunity/edit/${opp._id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(opp._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven’t posted any opportunities yet.</p>
      )}
    </div>
  );
};

export default DashboardSponsee;
