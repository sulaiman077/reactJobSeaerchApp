import React, { useState, useEffect } from 'react';
import { Checkbox, MenuItem, FormControl, InputLabel, Select, ListItemText } from '@mui/material';
import './SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const agencies = ['Gov Agency 1', 'Gov Agency 2', 'Gov Agency 3'];
const fields = ['IT', 'Finance', 'Marketing'];
const types = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const experiences = ['Junior', 'Senior', 'Mid-level'];

const SearchBar = ({ fetchJobs }) => {  // Accept fetchJobs as a prop
  const [search, setSearch] = useState('');
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);

  // Fetch jobs initially on first render
  useEffect(() => {
    fetchJobs(search, selectedAgencies, selectedFields, selectedTypes, selectedExperiences);
  }, []);  // Empty array means this runs only once when component mounts

  // Trigger job fetching manually on button click
  const handleSearchClick = () => {
    fetchJobs(search, selectedAgencies, selectedFields, selectedTypes, selectedExperiences);
  };

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    if (e.key === 'Enter') {
      fetchJobs(search, selectedAgencies, selectedFields, selectedTypes, selectedExperiences);
    }
  };

  const handleChange = (event, setSelected) => {
    const { target: { value } } = event;
    setSelected(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div className="search-bar-container">
      <h1>Make a Difference for Tomorrow</h1>
      <p className="search-subheading">Search for jobs using our AI Assisted Search Engine..</p>
      <div className="search-bar">
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={handleSearchInput}
            onKeyDown={handleSearchInput}  // Add this to trigger on Enter key
            placeholder="Search by job title"
            className="search-input"
          />
        </div>
      </div>
      <button
        className="clear-button"
        onClick={() => {
          setSearch('');
          setSelectedAgencies([]);
          setSelectedFields([]);
          setSelectedTypes([]);
          setSelectedExperiences([]);
        }}
      >
        Clear filter
      </button>
    </div>
  );
};

export default SearchBar;
