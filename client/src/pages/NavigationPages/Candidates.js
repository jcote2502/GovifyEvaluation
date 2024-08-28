import { Spinner, Center, VStack, Button, Box, Text, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CandidateCard from "../../components/cards/CandidateCard";
import AddNewModal from "../../components/modals/AddNewModal";
import NavBar from "../../components/NavBar";
import { useCandidates } from "../../contexts/CandidatesContext";

const Candidates = () => {
    
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });


    const {candidates, fetchCandidates, createCandidate} = useCandidates();

    const onOpen = () => setIsOpen(true);

    const onClose = () => {
        setIsOpen(false);
        setFormData({ firstName: '', lastName: '', email: '' });
    };

    useEffect(() => {
        async function fetchData() {
            await fetchCandidates();
            setLoading(false);
        }
        fetchData();
    }, [isOpen]);


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        createCandidate(formData);
        onClose();
    };

    const CandidateButton = () => {
        return (
            <Button onClick={onOpen}>Add New Candidate</Button>
        );
    };

    const mapCandidates = () => {
        return (
            candidates.reverse().map((candidate, index) => {
                return <CandidateCard key={index} data={candidate} />;
            })
        );
    };

    const renderPage = () => {
        return (
            <VStack>
                <CandidateButton />
                <HStack
                    margin='10px'
                    overflowY="auto"
                    justifyContent='center'
                    alignItems='center'
                    wrap='wrap'
                >
                    {candidates.length === 0 ? <Text w='100%' fontSize='22px'>No Candidates Available</Text> : mapCandidates()}
                </HStack>

                {/* Modal for adding new candidate */}
                <AddNewModal
                    isOpen={isOpen}
                    onClose={onClose}
                    editData={formData}
                    setEditData={setFormData}
                    handleUpdate={handleSubmit}
                    entityName='Add Candidate' />
            </VStack>
        );
    };

    const renderLoading = () => {
        return (
            <Center mt={10}>
                <Spinner size='xl' />
            </Center>
        );
    };

    return (
        <>
            <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' w='80%'>
                <NavBar activePage="/candidates" />
                {loading ? renderLoading() : renderPage()}
            </Box>
        </>
    );
};

export default Candidates;
