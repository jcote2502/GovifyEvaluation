import { useEffect, useState } from "react";
import { Spinner, Center, VStack, Button, Box, Text, HStack } from "@chakra-ui/react";
import AddNewModal from "../../components/modals/AddNewModal";
import NavBar from "../../components/NavBar";
import JobCard from "../../components/cards/JobCard";
import { useJobs } from "../../contexts/JobsContext";

const Jobs = () => {
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Modal visibility state
    const [formData, setFormData] = useState({ title: '', hiringManager: '', description: '', company:'' });
    const {jobs, fetchJobs, createJob} = useJobs();

    const onOpen = () => setIsOpen(true);
    const onClose = () => {
        setIsOpen(false);
        setFormData({ title: '', hiringManager: '', description: '', company:'' }); // Reset form data on close
    };

    useEffect(() => {
        async function fetchData() {
            await fetchJobs();
            setLoading(false);
        }
        fetchData();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        createJob(formData);
        onClose();

    };

    const renderPage = () => {
        return (
            <VStack>
                <Button onClick={onOpen}>Add New Job</Button>
                <HStack
                    margin='10px'
                    overflowY="auto"
                    justifyContent='center'
                    alignItems='center'
                    wrap='wrap'
                >
                    {jobs.length === 0 ? <Text w='100%' fontSize='22px'>No Jobs Posted</Text> : jobs.map((job, index) => (
                        <JobCard key={index} data={job} />
                    ))}
                </HStack>

                {/* Modal for adding new job */}
                <AddNewModal 
                isOpen={isOpen} 
                onClose={onClose} 
                editData={formData}
                setEditData={setFormData}
                handleUpdate={handleSubmit}
                entityName='Add Job'/>
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
                <NavBar activePage="/jobs" />
                {loading ? renderLoading() : renderPage()}
            </Box>
        </>
    );
};

export default Jobs;