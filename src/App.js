import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import JobList from './components/JobList';
import axios from 'axios';
import './App.css';

const API_BASE_URL = "https://dev-nextgpt.southeastasia.cloudapp.azure.com/_api";
const API_KEY = "336EVSmMQIgXEceGHH_znQuWwon6ZF20jtzrgGTiQus";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setJobs(response.data.d.results);
      } else {
        // Prepare the payload for the new API call
        const payload = {
          model: "C@G",
          messages: [{
            content
              :
              search,
            role
              :
              "user"
          }] // Or customize according to your needs
        };

        // const url = `${API_BASE_URL}/api/v1/chat/completions?debug=false`;
        const url = `https://cors-anywhere.herokuapp.com/https://dev-nextgpt.southeastasia.cloudapp.azure.com/_api/api/v1/chat/completions?debug=false`;



        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        const oResContent = data.choices[0].message.content;
        const parseJobs = (input) => {
          const jobs = [];
          // Split the input based on the pattern "Job X:" to identify each job block
          // const jobBlocks = input.split("\n");
          const splidData = input.split("\n");
          const cleanedArray = splidData.filter(item => 
            item.trim() !== "" && !item.trim().startsWith("Based on your search")
          );
          const jobBlocks = cleanedArray.map(item =>
            item.replace(/^\s*-\s*/, "").replace(/\*\*/g, "").trim()
          );
          const finalJob = {};
            let job = {};     
          jobBlocks.forEach((jobBlock) => {
                 
              if(jobBlock.indexOf("Jobtitle:") > -1 ||jobBlock.indexOf("Job Title:") > -1 || jobBlock.indexOf("Jobtitle") > -1){
                if(job.Jobtitle && job.Jobtitle.trim() !== "" && job.Jobtitle !== jobBlock.split(":")[1].trim()){
                  jobs.push(job);
                  job = {};
                }
                job.Jobtitle = jobBlock.split(":")[1].trim();
              }
              if(jobBlock.indexOf("Agncy:") > -1 ||jobBlock.indexOf("Agency:") > -1 ||jobBlock.indexOf("Agency:") > -1 ){
                job.Agncy = jobBlock.split(":")[1].trim();
              }
              if(jobBlock.indexOf("Agency ID: ") > -1 ||jobBlock.indexOf("Agency ID:") > -1 ||jobBlock.indexOf("Agency ID") > -1 ){
                job.Agnid = "000000"+jobBlock.split(":")[1].trim();
              }
              if(jobBlock.indexOf("ClosingDate: ") > -1 ||jobBlock.indexOf("Closing Date:") > -1 ||jobBlock.indexOf("ClosingDate") > -1 ){
                job.ClosingDate = jobBlock.split(":")[1].trim();
              }
              if(jobBlock.indexOf("EmpTypeTxt: ") > -1 ||jobBlock.indexOf("Employment Type:") > -1 ||jobBlock.indexOf("EmpTypeTxt") > -1 ){
                job.ClosingDate = jobBlock.split(":")[1].trim();
              }

              if(jobBlock.indexOf("Job Description: ") > -1){
                job.JobDesc = jobBlock.split(":")[1].trim();
              }
              if(jobBlock.indexOf("Job Responsibilities: ") > -1){
                job.JobRes = jobBlock.split(":")[1].trim();
              }

              if(jobBlock.indexOf("Job Requirements: ") > -1){
                job.JobReq = jobBlock.split(":")[1].trim();
              }
              // if(Object.entries(job).length > 0){
              //   jobs.push(job);
              // }
          });
          jobs.push(job);
          return jobs;
        };
        const output = parseJobs(oResContent);
        if (response.ok) {
          setJobs(output); // Adjust according to the API response structure
        } else {
          throw new Error(data.error || 'Error fetching data from secondary API');
        }
      }
    } catch (err) {
      setError(err.message || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <SearchBar fetchJobs={fetchJobs} />
      <JobList jobs={jobs} loading={loading} error={error} />
    </div>
  );
}

export default App;
