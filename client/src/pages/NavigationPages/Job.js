import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Box, Text, Spinner, Center, Button,VStack,HStack} from "@chakra-ui/react";

import NavBar from "../../components/NavBar";
import CandidateCard from "../../components/cards/CandidateCard";

import EditModal from "../../components/modals/EditModal";
import AssignModal from "../../components/modals/AssignModal";

import { useCandidates } from "../../contexts/CandidatesContext";
import { useAuth } from "../../contexts/AuthContext";
import { useAssignments } from "../../contexts/AssignmentContext";
import { useJobs } from "../../contexts/JobsContext";


const Job = () => {
    // gets the id from page title
    const { id } = useParams();

    // state management
    const [loading, setLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editJob, setEditJob] = useState({ title: "", description: "", hiringManager: "", company: "" });
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [refresh, callRefresh] = useState(false);

    // global context
    const { candidates, fetchAvailableCandidates } = useCandidates();
    const { assignments, fetchAssignmentsFor, assign ,removeAssignment} = useAssignments();
    const {admin} = useAuth();
    const {job , fetchJob, deleteJob, updateJob} = useJobs();

    // show loading animation until data fetch complete
    useEffect(() => {
        const fetchData = async () => {
            await fetchJob(id);
            setEditJob(job);
            await fetchAssignmentsFor(id,"job"); 
            setLoading(false);
        };
        fetchData();
    }, [id, isAssignModalOpen, refresh]);


    // Page Helper Functions
    const handleOpenAssignModal = () => {
        fetchAvailableCandidates(id);
        setIsAssignModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAssignModalOpen(false);
    };

    const handleOpenEditModal = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleAssignCandidate = async () => {
        assign(selectedCandidate,id,admin.ID);
        handleCloseModal();
    };

    const handleDeleteJob = async () => {
        deleteJob(id);
    };

    const handleUpdateJob = async () => {
        updateJob(id, editJob)
        handleCloseEditModal();
    };

    const handleRemoveCandidate = async (cID) => {
        removeAssignment(cID,id);
        callRefresh(!refresh);
    };

    // Unique Display Situations
    if (loading) {
        return (
            <Center mt={10}>
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!job) {
        return <Text>Job not found</Text>;
    }

    // Page Content
    return (
        <>
            <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' w='80%'>
                <NavBar activePage="nopage" />

                <VStack alignItems='center' w='100%'>
                    <Text fontFamily='body' fontSize='30px'>{job.title}</Text>
                    <Text fontFamily='heading' fontSize='28px'>{job.company}</Text>
                    <Text fontFamily='body' fontSize='18px' fontStyle='italic'>Hiring Manager: {job.hiringManager}</Text>
                    <Text fontFamily='body' >Description: {job.description}</Text>
                    <HStack margin='35px' w='700px' justifyContent='space-evenly'>
                        <Button w='250px' onClick={handleOpenAssignModal}>Assign Candidate to Job</Button>
                        <Button w='250px' onClick={handleOpenEditModal}>Edit</Button>
                    </HStack>
                    <Text marginTop='25px' fontSize='26px'>Associated Candidates</Text>
                    <HStack w='100%' justifyContent='center' alignItems='baseline' wrap='wrap'>
                        {assignments ? assignments.map((assignment, index) => {
                            return (
                                <CandidateCard
                                    key={index}
                                    data={assignment}
                                    hasDelete={true}
                                    DeleteFunction={() => handleRemoveCandidate(assignment.cID)} />
                            )
                        }) : <Text>No Assignments Yet</Text>}
                    </HStack>
                </VStack>

                {/* Assign Candidate Modal */}
                <AssignModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    handleAssign={handleAssignCandidate}
                    options={candidates}
                    selectedValue={selectedCandidate}
                    setSelectedValue={setSelectedCandidate}
                    entityName="Candidate"
                />

                {/* Edit Job Modal */}
                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    editData={editJob}
                    setEditData={setEditJob}
                    handleUpdate={handleUpdateJob}
                    handleDelete={handleDeleteJob}
                    entityName="Job"
                />

            </Box>
        </>
    );
};

export default Job;