import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- LogoutButton component ---
export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

// --- OpportunityList component ---
type SponsorshipLevel = {
  level: string;
  amount: number;
  benefits: string;
  sponsorId?: string;
};

type Opportunity = {
  _id: string;
  title: string;
  category?: string;
  tagline?: string;
  description: string;
  sponsorshipLevels: SponsorshipLevel[];
};

type OpportunityListProps = {
  opportunities: Opportunity[];
  error?: string;
  isSponsor: boolean;
};

const OpportunityList: React.FC<OpportunityListProps> = ({ opportunities, error, isSponsor }) => {
  const navigate = useNavigate();

  if (error) {
    return <p className="error-msg">{error}</p>;
  }

  if (!opportunities || opportunities.length === 0) {
    return <p>No opportunities found.</p>;
  }

  return (
    <div className="opportunity-list">
      {opportunities.map((opp) => (
        <div className="opportunity-card" key={opp._id}>
          <h3>{opp.title}</h3>
          {opp.tagline && <p>{opp.tagline}</p>}
          <p>{opp.description}</p>
          <div className="sponsorship-levels">
            {opp.sponsorshipLevels.map((level, idx) => (
              <div key={idx}>
                <strong>{level.level}</strong>: ${level.amount} - {level.benefits}
                {level.sponsorId && <span style={{ color: 'orange' }}> (Claimed)</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OpportunityList;
