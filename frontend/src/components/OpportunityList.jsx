import React from 'react';
import { useNavigate } from 'react-router-dom';

const OpportunityList = ({ opportunities, error, isSponsor }) => {
  const navigate = useNavigate();

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (opportunities.length === 0) {
    return <p>No opportunities found.</p>;
  }

  return (
    <div className="card-list">
      {opportunities.map((opp, idx) => (
        <div className="card" key={idx}>
          <div>
            <strong>{opp.title || 'Opportunity Title'}</strong>
            <p>{opp.description || 'Short description of the opportunity.'}</p>
          </div>
          <button
            className="button"
            onClick={() =>
              isSponsor
                ? navigate(`/opportunity/${opp._id}`)
                : navigate(`/opportunity/edit/${opp._id}`)
            }
          >
            {isSponsor ? 'View' : 'Manage'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default OpportunityList;
