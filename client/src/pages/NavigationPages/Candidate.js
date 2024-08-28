import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box,VStack,HStack, Text, Spinner, Center, Button } from "@chakra-ui/react";

import NavBar from "../../components/NavBar";
import JobCard from "../../components/cards/JobCard";

import EditModal from "../../components/modals/EditModal";
import AssignModal from "../../components/modals/AssignModal";

import { useJobs } from "../../contexts/JobsContext";
import { useCandidates } from "../../contexts/CandidatesContext";
import { useAuth } from "../../contexts/AuthContext";
import { useAssignments } from "../../contexts/AssignmentContext";


const Candidate = () => {
    // gets user from page title
    const { id } = useParams();

    // State Management
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState("");
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCandidate, setEditCandidate] = useState({ firstName: "", lastName: "", email: "" });
    const [refresh, callRefresh] = useState(false);

    // Global Contexts
    const { jobs, fetchAvailableJobs} = useJobs();
    const { candidate, updatedAt, fetchCandidate, updateCandidate, deleteCandidate} = useCandidates();
    const {assignments, fetchAssignmentsFor , removeAssignment, assign} = useAssignments();
    const {admin} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            await fetchCandidate(id); // Wait for the candidate to be fetched
            setEditCandidate(candidate);
            await fetchAssignmentsFor(id,"candidate"); // Ensure assignments are also fetched
            setLoading(false);
        };
    
        fetchData();
    }, [id, isAssignModalOpen, refresh]);

    // Page Helper Functions 
    const handleOpenAssignModal = () => {
        fetchAvailableJobs(id);
        setIsAssignModalOpen(true);
    };

    const handleOpenEditModal = () => {
        setEditCandidate(candidate);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleAssignJob = async () => {
        assign(id,selectedJob,admin.ID);
        setIsAssignModalOpen(false);
    };

    const handleUpdateCandidate = async () => {
        updateCandidate(id,editCandidate);
        handleCloseEditModal();
    };

    const handleDeleteCandidate = async () => {
        deleteCandidate(id);
    };

    const handleRemoveJob = async (jID) => {
        removeAssignment(id,jID);
        callRefresh(!refresh);
    };

    
    // Special Display Situations
    if (loading) {
        return (
            <Center mt={10}>
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!candidate) {
        return <Text>Candidate not found</Text>;
    }


    // Page Structure
    return (
        <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' w='80%'>
            <NavBar activePage="nopage" />


            <VStack alignItems='center' w='100%'>
                    <Text fontFamily='body' fontSize='34px'>{candidate.firstName} {candidate.lastName}</Text>
                    <Text fontFamily='body' fontSize='20px' fontStyle='italic'>{candidate.email}</Text>
                    <Text fontFamily='body' >Last Updated: {updatedAt}</Text>
                    <HStack margin='35px' w='700px' justifyContent='space-evenly'>
                        <Button w='250px' onClick={handleOpenAssignModal}>Assign Job to Candidate</Button>
                        <Button w='250px' onClick={handleOpenEditModal}>Edit</Button>
                    </HStack>
                    <Text marginTop='25px' fontSize='26px'>Associated Jobs</Text>
                    <HStack justifyContent='center' w='100%' wrap='wrap'>
                        {assignments ? assignments.map((assignment, index) => {
                            return (
                                <JobCard
                                    key={index}
                                    data={assignment}
                                    hasDelete={true}
                                    DeleteFunction={() => handleRemoveJob(assignment.jID)} />
                            )
                        }) : <Text>No Assignments Yet</Text>}
                    </HStack>
                </VStack>

            {/* Assign Candidate to Job Modal */}
            <AssignModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                handleAssign={handleAssignJob}
                options={jobs}
                selectedValue={selectedJob}
                setSelectedValue={setSelectedJob}
                entityName="Job"
            />

            {/* Edit Candidate Modal */}
            <EditModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                editData={editCandidate}
                setEditData={setEditCandidate}
                handleUpdate={handleUpdateCandidate}
                handleDelete={handleDeleteCandidate}
                entityName="Candidate"
            />
        </Box>
    );
};

export default Candidate;
