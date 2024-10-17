import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import JobList from './components/JobList';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);  // To store fetched job listings
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Function to fetch jobs from the API, which will be passed to SearchBar
  const fetchJobs = async (search, selectedAgencies, selectedFields, selectedTypes, selectedExperiences, sScenario) => {
    setLoading(true);
    setError(null);

    try {
      if (sScenario === "EMPTY") {
        const response = await axios.get('/sap/opu/odata/sap/ZGERCGS001_SRV/JobHeaderInfoSet', {
          params: {
            $filter: `Jobtitle eq '${search}'`,
            agencies: selectedAgencies.join(','),
            fields: selectedFields.join(','),
            types: selectedTypes.join(','),
            experience: selectedExperiences.join(',')
          }
        });
        setJobs(response.data.d.results);  // Set fetched jobs
      } else {
        const response = await axios.get('/sap/opu/odata/sap/ZGERCGS001_SRV/JobHeaderInfoSet', {
          params: {
            $filter: `Jobtitle eq '${search}'`,
            agencies: selectedAgencies.join(','),
            fields: selectedFields.join(','),
            types: selectedTypes.join(','),
            experience: selectedExperiences.join(',')
          }
        });
        setJobs(response.data.d.results);  // Set fetched jobs
      }
      
    } catch (err) {
      setError('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      {/* Pass the fetchJobs function to the SearchBar */}
      <SearchBar fetchJobs={fetchJobs} />
      {/* Pass the jobs, loading, and error state to JobList */}
      <JobList jobs={jobs} loading={loading} error={error} />
    </div>
  );
}

export default App;
