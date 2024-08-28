import React, { createContext, useContext, useState, useEffect } from "react";

const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
    const [assignments, setAssignments] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // if something has been updated in a child refresh the state
    useEffect(()=>{
        const fetchAssignments = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/candidatejobs/get');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAssignments(data.assignments);
            } catch (error) {
                console.error("Error Fetching Assignments:", error);
            }
        };
        fetchAssignments();
    },[refresh])

    // fetch all assignments
    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/candidatejobs/get');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAssignments(data.assignments);
        } catch (error) {
            console.error("Error Fetching Assignments:", error);
        }
    };

    // deletes assignment given the candidate and job
    const removeAssignment = async (cID, jobID) => {
        try {
            const response = await fetch(`http://localhost:3001/api/candidatejobs/delete/${cID}/${jobID}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error('Error Removing Assignment');
            }
            alert("Assignment Successfully Removed");
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error removing Assignment:', error);
        }
    };

    // create assignment for a candiate and job with the admin id
    // (given more time I would create an auth protocol for admin 
    //    with permission to only add or add and delete in the backend)
    const assign = async (cid, jid, adminID) => {
        try {
            const response = await fetch(`http://localhost:3001/api/candidatejobs/add/${cid}/${jid}/${adminID}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Error Making Assignment');
            }
            alert("Assignment Successful");
        } catch (error) {
            console.error('Error Making Assignment:', error);
        }
    };

    // get assignment candidates/jobs for specified id 
    async function fetchAssignmentsFor(id, type) {
        console.log(id,type);
        if (type === 'candidate') {
            try {

                const response = await fetch(`http://localhost:3001/api/candidatejobs/getjobsfor/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAssignments(data.jobs);
            } catch (error) {
                setAssignments(null);
                console.error("Error Fetching Jobs:", error);
            }
        }
        if (type === 'job') {
            try {
                console.log(id);
                const response = await fetch(`http://localhost:3001/api/candidatejobs/getcandidatesfor/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAssignments(data.candidates);
            } catch (error) {
                setAssignments(null);
                console.error("Error Fetching Assignments:", error);
            }
        }

    }

    return (
        <AssignmentContext.Provider value={{ assignments, fetchAssignments, assign, fetchAssignmentsFor, removeAssignment, setRefresh }}>
            {children}
        </AssignmentContext.Provider>
    );
};

// Custom hook to use the AssignmentContext
export const useAssignments = () => {
    return useContext(AssignmentContext);
};
