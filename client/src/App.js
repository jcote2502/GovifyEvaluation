import { ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Candidate from "./pages/NavigationPages/Candidate";
import Candidates from './pages/NavigationPages/Candidates';
import Job from "./pages/NavigationPages/Job";
import Jobs from './pages/NavigationPages/Jobs';
import Assignments from './pages/NavigationPages/Assignments';
import NoPage from './pages/NoAddressPage';
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";


import { AuthProvider } from "./contexts/AuthContext";
import { AssignmentProvider } from "./contexts/AssignmentContext";
import { JobsProvider } from './contexts/JobsContext';
import { CandidatesProvider } from './contexts/CandidatesContext';



function App() {

  const theme = extendTheme({
    
    fonts: {
      body: "'Roboto',sans-serif",
      heading: "'Lora', serif",
      mono: "'Fira Code', monospace"
    },
    styles: {
      global: {
        'html, body': {
          overflowY: "scroll", // Ensure vertical scroll is enabled
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Internet Explorer and Edge
        },
        '*::-webkit-scrollbar': {
          display: "none",  // Chrome , Safari , Opera
        },
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: '#0d0d15',
          color: 'white',
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <JobsProvider>
            <CandidatesProvider>
              <AssignmentProvider>
                <VStack>
                  <Routes>
                    <Route path='/' exact element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/jobs' element={<Jobs />} />
                    <Route path='/candidates' element={<Candidates />} />
                    <Route path='/assignments' element={<Assignments />} />
                    <Route path="/candidate/:id" element={<Candidate />} />
                    <Route path='/job/:id' element={<Job />} />
                    <Route path='*' element={<NoPage />} />
                  </Routes>
                </VStack>
              </AssignmentProvider>
            </CandidatesProvider>
          </JobsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
