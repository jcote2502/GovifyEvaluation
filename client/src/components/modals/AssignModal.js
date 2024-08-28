import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
    Button,
    FormControl,
} from "@chakra-ui/react";


// used when applicated needs to create an assignment record
const AssignModal = ({ isOpen, onClose, handleAssign, options, selectedValue, setSelectedValue, entityName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color='black'>Assign {entityName}</ModalHeader>
                <ModalCloseButton color='black' />
                <ModalBody>
                    <FormControl>
                        <Select
                            placeholder={`Select ${entityName}`}
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            color='black'
                        >
                            {
                                options.map((item) => {
                                    if (entityName === 'Job') {
                                        return (
                                            <option key={item.jID} value={item.jID}>
                                                {item.title} - {item.company} : {item.hiringManager}
                                            </option>
                                        )
                                    }
                                    else if (entityName === 'Candidate') {
                                        return (
                                        <option key={item.cID} value={item.cID}>
                                            {`${item.firstName} ${item.lastName} - ${item.email}`}
                                        </option>);
                                    }
                                    return;
                                })}
                        </Select>
                    </FormControl> 
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleAssign}>
                        Assign
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AssignModal;
