import { VStack, Text, IconButton, HStack } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const CandidateCard = (props) => {
    const { data, hasDelete = false, DeleteFunction } = props;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/candidate/${data.cID}`);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        DeleteFunction();
    };

    return (
        <HStack
            h='120px'
            w='250px'
            bg="transparent"
            border="1px solid #ccc"
            color="rgb(255, 255, 255)"
            margin='25px'
            fontSize='16px'
            borderRadius='25px'
            justifyContent='space-evenly'
            _hover={{ bg: "rgb(42, 44, 50)", cursor: 'pointer' }}
            onClick={handleClick}
        >
            <VStack justifyContent='center' alignItems='center' h="full">
                <Text>{`${data.firstName} ${data.lastName}`}</Text>
                <Text fontSize={hasDelete ? '10px' : '14px'}>{data.email}</Text>
            </VStack>
            {hasDelete ? (
                <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    variant="outline"
                    borderColor='rgb(155, 9, 9)'
                    color='rgb(155, 9, 9)'
                    onClick={handleDeleteClick}
                />
            ) : null}
        </HStack>
    );
};

export default CandidateCard;
