import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import the authentication context
import { Link as RouterLink } from "react-router-dom";
import {
    Flex,
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    Avatar,
    FormControl,
    InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const SignUp = () => {
    const { signup, error } = useAuth(); // Get signup and error from context
    const [email, setEmail] = useState(""); // State for email
    const [password, setPassword] = useState(""); // State for password
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const handleShowClick = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            await signup(email, password); // Call the signup function
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                flexDir="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
            >
                <Avatar bg="teal.500" />
                <Heading color="teal.400">Admin Register</Heading>
                {error && <Box color="red.500">{error}</Box>} {/* Display error message */}
                <Box minW={{ base: "90%", md: "468px" }}>
                    <form onSubmit={handleSubmit}> {/* Attach handleSubmit */}
                        <Stack
                            spacing={4}
                            p="1rem"
                            backgroundColor="whiteAlpha.900"
                            boxShadow="md"
                        >
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<CFaUserAlt color="gray.300" />}
                                    />
                                    <Input
                                        color='black'
                                        type="email"
                                        placeholder="Email address"
                                        value={email} // Bind email state
                                        onChange={(e) => setEmail(e.target.value)} // Update email state
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        color="gray.300"
                                        children={<CFaLock color="gray.300" />}
                                    />
                                    <Input
                                        color='black'
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password} // Bind password state
                                        onChange={(e) => setPassword(e.target.value)} // Update password state
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button
                                borderRadius={0}
                                type="submit" // Set type to submit
                                variant="solid"
                                colorScheme="teal"
                                width="full"
                            >
                                Register
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
            <Box>
                Already have an account?{" "}
                <Link as={RouterLink} to="/" color="teal.500">
                    Login
                </Link>
            </Box>
        </Flex>
    );
};

export default SignUp;
