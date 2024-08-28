import React, { useEffect, useState } from 'react';
import { Box, Spinner, Center, Text } from '@chakra-ui/react';
import NavBar from "../../components/NavBar";
import AssignmentCard from '../../components/cards/AssignmentCard';
import { useAssignments } from '../../contexts/AssignmentContext';

const Assignments = () => {
    const { assignments , fetchAssignments} = useAssignments();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchData = async () => {
            await fetchAssignments();
            setLoading(false)
        }
        fetchData();
    },[]);

    
    if (loading) {
        return (
            <Center mt={10}>
                <Spinner size="xl" />
            </Center>
        );
    }
    if (assignments.length === 0) {
        return (
            <>
                <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' w='80%'>
                    <NavBar activePage="/assignments" />
                    <Text fontSize='22px'>No Assignments Yet</Text>
                </Box>
            </>
        );
    }

    return (
        <>
            <Box display='flex' flexDir='column' alignItems='center' justifyContent='center' w='80%'>
                <NavBar activePage="/assignments" />

                {assignments.map((job, index) => (
                    <AssignmentCard key={index} assignment={job} />
                ))}

            </Box>
        </>
    );
};

export default Assignments;
