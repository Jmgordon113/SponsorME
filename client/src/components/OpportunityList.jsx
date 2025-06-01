import React from 'react';

function OpportunityList({ opportunities, error, isSponsor }) {
  if (error) return <p className="error-msg">{error}</p>;
  if (!opportunities || opportunities.length === 0) return <p>No opportunities found.</p>;

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
}

export default OpportunityList;
