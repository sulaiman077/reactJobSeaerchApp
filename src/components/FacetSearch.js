import React, { useState } from 'react';

const FacetSearch = ({ filters, onFilterChange, agencyJobCounts, typeJobCounts }) => {
  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];

  const [isJobTypeOpen, setIsJobTypeOpen] = useState(true);
  const [isAgencyOpen, setIsAgencyOpen] = useState(true);
  const [isExperienceLevelOpen, setIsExperienceLevelOpen] = useState(true);

  return (
    <div className="facet-search-container">
      <h3>Filter Jobs</h3>

      {/* Job Type Filter Section */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setIsJobTypeOpen(!isJobTypeOpen)}>
          <h4>Job Type</h4>
          <button>{isJobTypeOpen ? '-' : '+'}</button>
        </div>
        {isJobTypeOpen && (
          <div className="filter-content">
            {
            Object.keys(typeJobCounts).map((type) => (
              <div key={type}>
                <input
                  type="checkbox"
                  name="type"
                  value={type}
                  checked={filters.type.includes(type)}
                  onChange={(e) => onFilterChange(e, 'type')}
                />
                <label className="agency-label">{type} ({typeJobCounts[type]})</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agency Filter Section with Counts */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setIsAgencyOpen(!isAgencyOpen)}>
          <h4>Agency</h4>
          <button>{isAgencyOpen ? '-' : '+'}</button>
        </div>
        {isAgencyOpen && (
          <div className="filter-content">
            {Object.keys(agencyJobCounts).map((agency) => (
              <div key={agency}>
                <input
                  type="checkbox"
                  name="agency"
                  value={agency}
                  checked={filters.agency.includes(agency)}
                  onChange={(e) => onFilterChange(e, 'agency')}
                />
                <label className="agency-label">{agency} ({agencyJobCounts[agency]})</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience Level Filter Section */}
      <div className="filter-section">
        <div className="filter-header" onClick={() => setIsExperienceLevelOpen(!isExperienceLevelOpen)}>
          <h4>Experience Level</h4>
          <button>{isExperienceLevelOpen ? '-' : '+'}</button>
        </div>
        {isExperienceLevelOpen && (
          <div className="filter-content">
            {experienceLevels.map((level) => (
              <div key={level}>
                <input
                  type="checkbox"
                  name="experience"
                  value={level}
                  checked={filters.experience.includes(level)}
                  onChange={(e) => onFilterChange(e, 'experience')}
                />
                <label>{level}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacetSearch;
