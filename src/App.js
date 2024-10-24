import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import JobList from "./components/JobList";
import axios from "axios";
import Papa from 'papaparse';
import "./App.css";

const API_BASE_URL =
  "https://dev-nextgpt.southeastasia.cloudapp.azure.com/_api";
const API_KEY = "Vc4LfRhsbVllC2H-foIjOSQv-2ldhjylt09VBJVp-Hg";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (
    search,
    selectedAgencies,
    selectedFields,
    selectedTypes,
    selectedExperiences,
    sScenario
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (sScenario === "EMPTY") {
        console.log(
          "Filters",
          selectedAgencies,
          selectedFields,
          selectedTypes,
          selectedExperiences
        );
        console.log("search", search);
        const response = await axios.get(
          "/sap/opu/odata/sap/ZGERCGS001_SRV/JobHeaderInfoSet",
          {
            params: {
              $filter: `Jobtitle eq '${search}'`,
              agencies: selectedAgencies.join(","),
              fields: selectedFields.join(","),
              types: selectedTypes.join(","),
              experience: selectedExperiences.join(","),
            },
          }
        );
        console.log(response.data.d.results);
        setJobs(response.data.d.results);
      } else {
        console.log(
          "Filters",
          selectedAgencies,
          selectedFields,
          selectedTypes,
          selectedExperiences
        );
        // Prepare the payload for the new API call
        const payload = {
          model: "Ian-Test",
          messages: [
            {
              content: search,
              role: "user",
            },
          ], // Or customize according to your needs
        };

        const url = `${API_BASE_URL}/api/v1/chat/completions?debug=false`;
        //const url = `https://cors-anywhere.herokuapp.com/https://dev-nextgpt.southeastasia.cloudapp.azure.com/_api/api/v1/chat/completions?debug=false`;

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
        const parseJobs = async (input) => {
          // Split the input based on the pattern "Job X:" to identify each job block
          // const jobBlocks = input.split("\n");
          let startIndex = input.indexOf("{");
          let endIndex = input.lastIndexOf("}");

          var cleaningString = input.substring(startIndex, endIndex + 1);
          cleaningString = cleaningString
            .replace(/^\s*-\s*/, "")
            .replace(/\*\*/g, "")
            .trim();

          console.log("Before parsing", cleaningString);

          const cleanedInput = JSON.parse(cleaningString);

          const resFilter = {
            Jobtitle: cleanedInput["Jobtitle"] || "",
            Agncy: cleanedInput["Agency"],
            Agnid: cleanedInput["AgencyID"] || "",
            ClosingDate: cleanedInput["ClosingDate"] || "",
            EmpTypeTxt: cleanedInput["EmpTypeTxt"] || "",
            KeyWords: cleanedInput["KeyWords"],
            ExperienceLevel: cleanedInput["ExperienceLevel"] || "",
          };

          console.log(resFilter);

          // Read the CSV file CareersGov.csv
          const csvResponse = await fetch("/CareersGov.csv");
          const csvText = await csvResponse.text();

          // Parse the CSV data
          const parsedData = Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
          }).data;

          const filteredData = parsedData.filter(item => {
            const matchesKeyWords = resFilter.KeyWords && resFilter.KeyWords.length > 0 && resFilter.KeyWords[0] 
                ? resFilter.KeyWords.some(keyword => {
                    const lowerKeyword = keyword.toLowerCase();
                    const jobDescMatch = item["Jobdesc"]?.toLowerCase().includes(lowerKeyword) ?? false;
                    const jobResMatch = item["Jobres"]?.toLowerCase().includes(lowerKeyword) ?? false;
                    const jobReqMatch = item["Jobreq"]?.toLowerCase().includes(lowerKeyword) ?? false;
                    return jobDescMatch || jobResMatch || jobReqMatch;
                })
                : true; // If no keywords filter, consider it a match.
        
            const matchesJobTitle = resFilter.Jobtitle && resFilter.Jobtitle.length > 0 
                ? item["Jobtitle"]?.toLowerCase().includes(resFilter.Jobtitle.toLowerCase()) ?? false
                : true; // If no job title filter, consider it a match.
        
            const matchesAgnid = resFilter.Agnid && resFilter.Agnid.length > 0 
                ? item["Agnid"]?.toLowerCase().includes(resFilter.Agnid.toLowerCase()) ?? false
                : true; // If no Agnid filter, consider it a match.
        
            const matchesEmpTypeTxt = resFilter.EmpTypeTxt && resFilter.EmpTypeTxt.length > 0 && resFilter.EmpTypeTxt[0]
                ? item["EmpTypeTxt"]?.toLowerCase().includes(resFilter.EmpTypeTxt[0].toLowerCase()) ?? false
                : true; // If no EmpTypeTxt filter, consider it a match.
        
            // const matchesClosingDate = resFilter.ClosingDate && resFilter.ClosingDate.length > 0 
            //     ? item["ClosingDate"]?.toLowerCase().includes(resFilter.ClosingDate.toLowerCase()) ?? false
            //     : true; // If no ClosingDate filter, consider it a match.
        
            // All conditions must be true to include the item in the filtered data.
            return matchesKeyWords && matchesJobTitle && matchesAgnid && matchesEmpTypeTxt; //&& matchesClosingDate;
        });

          console.log("Filtered Data", filteredData);
          return filteredData;
        };
        const output = await parseJobs(oResContent);
        if (response.ok) {
          setJobs(output); // Adjust according to the API response structure
        } else {
          throw new Error(
            data.error || "Error fetching data from secondary API"
          );
        }
      }
    } catch (err) {
      console.log(err);
      setError(err.message || "Error fetching jobs");
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
