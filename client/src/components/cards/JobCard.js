import { VStack, Text, IconButton,  HStack } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const JobCard = (props) => {
    const { data, hasDelete = false, DeleteFunction } = props;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/job/${data.jID}`);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation(); 
        DeleteFunction();
    };

    return (
        <HStack 
            h={hasDelete ? '130px' :'150px' }
            w={hasDelete ? '400px' :'300px' }
            bg="transparent"
            border="1px solid #ccc"
            color="rgb(255, 255, 255)" 
            margin='25px' 
            borderRadius='25px'
            alignItems='center'
            justifyContent="space-evenly" 
            _hover={{ bg: "rgb(42, 44, 50)", cursor: 'pointer' }}
            onClick={handleClick}
        >
            <VStack justifyContent='center' alignItems='center' h="full">
                <Text>{data.title}</Text>
                <Text>{data.company}</Text>
                <Text>Hiring Manager: {data.hiringManager}</Text>
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

export default JobCard;