import React, { useState } from 'react';
import { Box, HStack, Text, IconButton, Collapse } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import CandidateCard from './CandidateCard';
import { useAssignments } from '../../contexts/AssignmentContext';

// Appears in Current Assignments Page

const AssignmentCard = ({ assignment }) => {
    const { job, candidates } = assignment;
    const { removeAssignment } = useAssignments();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box w="100%" border="1px solid #ccc" borderRadius="md" padding='25px' margin='35px'>
            <HStack w='fit-content' alignItems='flex-end'>
                <Text fontFamily='body' fontSize="32px" fontWeight="bold">{job.title}</Text>
                <Text fontFamily='sans-serif' fontSize='32px' paddingLeft='15px' fontStyle='italic'>{job.company}</Text>
            </HStack>

            <Text margin='10px'>{job.description}</Text>
            <Text margin='10px' fontWeight="bold">Hiring Manager: {job.hiringManager}</Text>
            <HStack>
                <Text margin='10px' fontFamily='mono' fontSize="22px" fontWeight="bold">Candidates</Text>
                <IconButton
                    aria-label={isOpen ? "Collapse candidates" : "Expand candidates"}
                    icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    onClick={() => setIsOpen(!isOpen)}
                    variant="outline"
                    colorScheme="yellow"
                />
            </HStack>
            <Collapse in={isOpen}>
                <HStack wrap='wrap'>
                    {candidates.length > 0 ? (
                        candidates.map((candidate) => (
                            <CandidateCard
                                key={candidate.cID}
                                data={candidate}
                                hasDelete={true}
                                DeleteFunction={() => removeAssignment(candidate.cID, job.jID)}
                            />
                        ))
                    ) : (
                        <Text>No candidates assigned to this job.</Text>
                    )}
                </HStack>
            </Collapse>
        </Box>
    );
};

export default AssignmentCard;
