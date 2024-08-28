import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Button
} from "@chakra-ui/react";

// used in cases where application needs to update a record using a form
const EditModal = ({ isOpen, onClose, editData, setEditData, handleUpdate, handleDelete, entityName }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    const fields = ["firstName", "lastName", "email", "company", "title", "description", "hiringManager"];
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color='black'>Edit {entityName}</ModalHeader>
                <ModalCloseButton color='black' />
                <ModalBody>
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
                    <Button colorScheme="red" mr={3} onClick={handleDelete}>
                        Delete {entityName}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditModal;
