import React from "react";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input } from "@chakra-ui/react";


// used in cases where application needs to create a new record using a form
const AddNewModal = ({ isOpen, onClose, editData, setEditData, handleUpdate, entityName }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    // possible fields to appear in the form
    const fields = ["firstName", "lastName", "email", "company", "title", "description", "hiringManager"];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color='black'>{entityName}</ModalHeader>
                <ModalCloseButton color='black' />
                <ModalBody>
                    {/* Iterate through possible fields, validate its presence and insert in form */}
                    {Object.keys(editData).map((key) => {
                        if (fields.includes(key)) {
                            return (
                                <FormControl key={key} mt={4}>
                                    <FormLabel color='black'>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                                    <Input
                                        name={key}
                                        value={editData[key]}
                                        onChange={handleInputChange}
                                        placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                        color='black'
                                    />
                                </FormControl>
                            )
                        }
                        return;

                    })}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={handleUpdate}>
                        Save Changes
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddNewModal;
