import React, { createContext, useContext, useState } from 'react';
import errorMessages from '../errors/errors';
import { useNavigate } from 'react-router-dom';

const CandidatesContext = createContext();

export const CandidatesProvider = ({ children }) => {
    const [candidates, setCandidates] = useState([]);
    const [candidate, setCandidate] = useState({});
    const [updatedAt, setUpdatedAt] = useState({})
    const navigate = useNavigate();

    const createCandidate = async (formData) => {
        try {
            const response = await fetch(`http://localhost:3001/api/candidates/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newCandidate = await response.json();
            setCandidates((prevCandidates) => [...prevCandidates, newCandidate.candidate]);
        } catch (error) {
            console.error("Error adding candidate:", error);
        }
    }


    const fetchAvailableCandidates = async (jobId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/candidatejobs/unassigned-candidates/${jobId}`);
            if (!response.ok) throw new Error('Failed to fetch candidates');
            const data = await response.json();
            setCandidates(data.candidates);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    async function fetchCandidates() {
        try {
            const response = await fetch(`http://localhost:3001/api/candidates/getall`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCandidates(data.candidates);
        } catch (error) {
            console.error("Error Fetching Candidates:", error);
        }
    }


    const fetchCandidate = async (id) => {
        const options = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        try {
            const response = await fetch(`http://localhost:3001/api/candidates/get/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const date = new Date(`${data.candidate.updatedAt}`)
            setCandidate(data.candidate)
            setUpdatedAt(date.toLocaleString('en-US', options))
        } catch (error) {
            console.error("Error Fetching Candidate:", error);
        }
    }

    const updateCandidate = async (id, editCandidate) => {
        try {
            const response = await fetch(`http://localhost:3001/api/candidates/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editCandidate),
            });

            if (!response.ok) {
                const data = await response.json();
                alert(errorMessages[data.message]);
                throw new Error('Error updating candidate');
            }
            alert("Candidate Updated Successfully");
            setCandidate(editCandidate);
        } catch (error) {
            console.error('Error updating candidate:', error);
        }
    };

    const deleteCandidate = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/candidates/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting candidate');
            }
            alert("Candidate Deleted Successfully");
            navigate("/candidates");
        } catch (error) {
            console.error('Error deleting candidate:', error);
        }
    };

    return (
        <CandidatesContext.Provider value={{
            candidates, candidate, updatedAt,
            fetchAvailableCandidates, fetchCandidate, updateCandidate, deleteCandidate, fetchCandidates,
            createCandidate
        }}>
            {children}
        </CandidatesContext.Provider>
    );
};

export const useCandidates = () => useContext(CandidatesContext);
