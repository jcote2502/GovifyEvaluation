import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import errorMessages from '../errors/errors';
const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [job, setJob] = useState([]);
    const navigate = useNavigate();

    async function fetchJob(id) {
        try {
            const response = await fetch(`http://localhost:3001/api/jobs/get/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setJob(data.job);
        } catch (error) {
            console.error("Error Fetching Job:", error);
        }
    }

    const fetchAvailableJobs = async (candidateId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/candidatejobs/unassigned-jobs/${candidateId}`);
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            setJobs(data.jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const deleteJob = async (id) => { 
        try {
            const response = await fetch(`http://localhost:3001/api/jobs/delete/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert("Job Deleted Successfully");
            navigate("/jobs");
        } catch (error) {
            console.error("Error Deleting Job:", error);
        }
    };
    const updateJob = async (id,editJob) => {
        try {
            const response = await fetch(`http://localhost:3001/api/jobs/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editJob),
            });

            if (!response.ok) {
                const data = await response.json();
                alert(errorMessages[data.message]);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert("Job Updated Successfully");
            setJob({ ...job, ...editJob });
        } catch (error) {
            console.error("Error Updating Job:", error);
        }
    };
    async function fetchJobs() {
        try {
            const response = await fetch(`http://localhost:3001/api/jobs/getall`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setJobs(data.jobs);
        } catch (error) {
            console.error("Error Fetching Jobs:", error);
        }
    }
    async function createJob(formData){
        try {
            const response = await fetch(`http://localhost:3001/api/jobs/addjob`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const newJob = await response.json();
            setJobs((prevJobs) => [...prevJobs, newJob.job]);
        } catch (error) {
            console.error("Error adding job:", error);
        }
    }
   

    return (
        <JobsContext.Provider value={{job, jobs, fetchAvailableJobs,createJob ,fetchJobs, fetchJob, deleteJob, updateJob }}>
            {children}
        </JobsContext.Provider>
    );
};

export const useJobs = () => useContext(JobsContext);
