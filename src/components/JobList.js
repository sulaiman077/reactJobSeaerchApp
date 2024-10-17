import React, { useState } from 'react';
import './JobList.css';
import FacetSearch from './FacetSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faUserTie, faLaptopCode, faChartLine } from '@fortawesome/free-solid-svg-icons';

const JobList = ({ jobs, loading, error }) => {
  const [filters, setFilters] = useState({
    type: [],
    agency: [],
    experience: []
  });

  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());

  const agencyJobCounts = jobs.reduce((acc, job) => {
    acc[job.Agncy] = (acc[job.Agncy] || 0) + 1;
    return acc;
  }, {});

  const typeJobCounts = jobs.reduce((acc, job) => {
    acc[job.EmpTypeTxt] = (acc[job.EmpTypeTxt] || 0) + 1;
    return acc;
  }, {});

  const expJobCounts = jobs.reduce((acc, job) => {
    acc[job.EmpTypeTxt] = (acc[job.EmpTypeTxt] || 0) + 1;
    return acc;
  }, {});

  const handleFilterChange = (e, filterType) => {
    const { value, checked } = e.target;
    setFilters((prevFilters) => {
      const filterValues = prevFilters[filterType];
      return {
        ...prevFilters,
        [filterType]: checked
          ? [...filterValues, value]
          : filterValues.filter((item) => item !== value)
      };
    });
  };

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs((prevBookmarks) => {
      const newBookmarks = new Set(prevBookmarks);
      if (newBookmarks.has(jobId)) {
        newBookmarks.delete(jobId);
      } else {
        newBookmarks.add(jobId);
      }
      return newBookmarks;
    });
  };

  const getClosingDateClass = (closingDate) => {
    const currentDate = new Date();
    const closing = new Date(closingDate);
    const differenceInDays = Math.ceil((closing - currentDate) / (1000 * 3600 * 24));
    if (differenceInDays <= 3) return 'closing-soon';
    if (differenceInDays <= 7) return 'closing-warning';
    return 'closing-safe';
  };

  const getAgencyImage = (Agnid) => {
    try {
      return require(`../assets/${Agnid}.png`);
    } catch (error) {
      console.warn(`Image for agency ${Agnid} not found. Using placeholder.`);
      return require('../assets/placeholder.png');
    }
  };

  const recommendedJobs = [
    {
      id: 1,
      Jobtitle: 'Data Analyst',
      Agncy: 'Health Ministry',
      EmpTypeTxt: 'Permanent',
      ExperienceLevel: 'Mid-Level',
      ClosingDate: '12 Dec 2024'
    },
    {
      id: 2,
      Jobtitle: 'Senior Developer',
      Agncy: 'Finance Ministry',
      EmpTypeTxt: 'Contract',
      ExperienceLevel: 'Senior',
      ClosingDate: '01 Jan 2025'
    },
    {
      id: 3,
      Jobtitle: 'Project Manager',
      Agncy: 'Public Works',
      EmpTypeTxt: 'Fixed Term',
      ExperienceLevel: 'Mid-Level',
      ClosingDate: '05 Feb 2025'
    }
  ];

  const filteredJobs = jobs.filter((job) => {
    return (
      (filters.type.length === 0 || filters.type.includes(job.EmpTypeTxt)) &&
      (filters.agency.length === 0 || filters.agency.includes(job.Agncy)) &&
      (filters.experience.length === 0 || filters.experience.includes(job.ExperienceLevel))
    );
  });

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="rotating-cube"></div>
        <p className="loading-text">Fetching the latest jobs...</p>
      </div>
    );
  }

  if (error) return <p aria-live="assertive">{error}</p>;
  if (!filteredJobs.length) return <p>No jobs found.</p>;

  return (
    <div className="job-page-container">
      <FacetSearch
        filters={filters}
        onFilterChange={handleFilterChange}
        agencyJobCounts={agencyJobCounts}
        typeJobCounts={typeJobCounts}
      />
      <div className="job-list-container">
        <h2>Job Listings</h2>
        <h4>{filteredJobs.length} results</h4>
        {filteredJobs.map((job, index) => (
          <div key={index} className="job-card">
            <div className="job-header">
              <img src={getAgencyImage(job.Agnid)} alt={`${job.Agncy} logo`} className="job-icon" />
              <div className="job-content">
                <h3 className="job-title">{job.Jobtitle}</h3>
                <p className="job-agency">{job.Agncy}</p>
                <p className="job-type">{job.EmpTypeTxt}</p>
                <p className={`job-closing-date ${getClosingDateClass(job.ClosingDate)}`}>
                  Closing on {job.ClosingDate}
                </p>
                <div className="icon-container">
                  <div className="job-icon-wrapper">
                    <FontAwesomeIcon icon={faUserTie} className="icon" />
                    <span className="tooltip">Role: {job.JobReq}</span>
                  </div>
                  <div className="job-icon-wrapper">
                    <FontAwesomeIcon icon={faLaptopCode} className="icon" />
                    <span className="tooltip">Department: {job.JobRes}</span>
                  </div>
                  <div className="job-icon-wrapper">
                    <FontAwesomeIcon icon={faChartLine} className="icon" />
                    <span className="tooltip">Skills: {job.JobDesc}</span>
                  </div>
                </div>
              </div>
              <FontAwesomeIcon
                icon={bookmarkedJobs.has(job.id) ? solidBookmark : regularBookmark}
                className="bookmark-icon"
                onClick={() => toggleBookmark(job.id)}
              />
            </div>
            <button className="apply-button">Apply</button>
          </div>
        ))}
      </div>
      {/* Recommended Jobs Section */}
      <div className="proposed-jobs-container">
        <h2>Recommended Jobs</h2>
        {recommendedJobs.map((job, index) => (
          <div key={index} className="job-card">
            <div className="job-header">
              <div className="job-content">
                <h3 className="job-title">{job.Jobtitle}</h3>

                <p className="job-type"></p>
                <p className={`job-closing-date ${getClosingDateClass(job.ClosingDate)}`}>
                  Closing on {job.ClosingDate}
                </p>
              </div>
              <FontAwesomeIcon
                icon={bookmarkedJobs.has(job.id) ? solidBookmark : regularBookmark}
                className="bookmark-icon"
                onClick={() => toggleBookmark(job.id)}
              />
            </div>

            <button className="apply-button">Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
