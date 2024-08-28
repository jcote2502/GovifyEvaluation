import { HStack, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navPages = [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Find Candidates", href: "/candidates" },
    { label: "Current Assignments", href: "/assignments" },
    { label: "Load Data", isLoad: true },
    { label: "Logout", href: "/", isLogOut: true },
];

const NavBar = ({ activePage }) => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleNavigate = (path) => {
        navigate(path);
    }

    // wanted to build an context hierarchy but didn't have time
    // implemented by fetch in front end because it would need to touch all auths  
    const handleLoadData = async () => {

        const tables = ["candidates", "jobs", "candidatejobs"];

        tables.forEach(async (table) => {
            try {
                const response = await fetch(`http://localhost:3001/api/${table}/dataload`, {
                    method: 'POST'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error Fetching ${table}:`, error);
            }
        })
        alert('Successfully loaded in data. Refresh page to see changes.')
        navigate('/jobs');
    }

    // Will check for type of button to display and return
    const NavButton = ({ onClick, item, index, isLogOut = false }) => (

        isLogOut ?
            <Button
                key={index}
                onClick={onClick}
                color='#ffffff'
                fontFamily='arial'
                borderRadius='30px'
                backgroundColor={'red.500'}
                _hover={{ bg: 'rgb(250,250,250)', color: 'red.500' }}
            >{item.label}</Button>
            :
            <Button
                key={index}
                onClick={onClick}
                color='#ffffff'
                fontFamily='arial'
                borderRadius='30px'
                backgroundColor={
                    activePage === item.href ?
                        "rgb(42, 44, 50)" : "transparent"
                }
                _hover={{ bg: 'rgb(120,120,120)' }}
            >{item.label}</Button>
    )

    return (
        <>

            {/* Company Name + Slogan (I usually use a provided logo image here) */}
            <Text style={{
                position: "absolute",
                left: 30,
                top: 25,
                fontSize: '32px',
                fontFamily: 'mono'
            }}>StarFinder</Text>
            <Text style={{
                position: "absolute",
                left: 45,
                top: 58,
                fontSize: '14px',
                fontFamily: 'body'
            }}>Find Your Success</Text>


            {/* Nav Bar Map Buttons and control on click and view  */}
            <HStack w='100%' marginTop='35px' marginBottom='75px' justifyContent='flex-end'>
                {/* compnay logo */}
                {navPages.map((item, index) => {
                    if (item.isLoad) {
                        return (
                            <NavButton key={index} onClick={() => handleLoadData()} index={index} item={item} />
                        )

                    }
                    else if (item.isLogOut) {
                        return (
                            <NavButton isLogOut={item.isLogOut} key={index} onClick={logout} index={index} item={item} />
                        )
                    }
                    else {
                        return (
                            <NavButton key={index} onClick={() => handleNavigate(item.href)} index={index} item={item} />
                        )
                    }
                })}
            </HStack>
        </>
    )
}

export default NavBar;