import React from 'react';
import './JobList.css';

const JobList = ({ jobs, loading, error }) => {  // Accept jobs, loading, and error as props
  console.log("Job data received in JobList:", jobs);
  return (
    <div className="job-section-container">
      {/* Job Listings Section */}
      <div className="job-list-container">
        <h2>Job Listings</h2>

        {loading && <p>Loading jobs...</p>}  {/* Show loading message */}
        {error && <p>{error}</p>}  {/* Show error message */}

        {/* Show job results count */}
        {!loading && !error && jobs.length > 0 && (
          <h4>{jobs.length} results</h4>
        )}

        {/* Display jobs */}

        
        {!loading && !error && jobs.length > 0 && (
          jobs.map((job, index) => (
            <div className="job-card" key={index}>
              <div className="job-header">
                <h3 className="job-title">{job.Jobtitle}</h3>
                {job.isNew && <span className="new-badge">New</span>}
              </div>
              <p className="job-agency">{job.Agncy} | {job.Extxt}</p>
              <div className="job-details">
                <span className="job-type">{job.EmpTypeTxt}</span>
                <span className="job-closing-date">{job.ClosingDate}</span>
              </div>
            </div>
          ))
        )}

        {/* Handle empty state (no jobs) */}
        {!loading && !error && jobs.length === 0 && (
          <p>No jobs found.</p>
        )}
      </div>

      {/* (Optional) Add Recommended Jobs section if needed */}
      <div className="proposed-jobs-container">
        <h2>Recommended Jobs</h2>
        <p>Recommended jobs can be populated here...</p>
        {/* You can dynamically render recommended jobs here */}
      </div>
    </div>
  );
};

export default JobList;
