import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Box width="100vw" height="100vh" display="flex" flexDirection='column'>
        <Navbar />
        <Container
          maxWidth="lg"
          disableGutters
          sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
        >
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </>
  );
}

export default MainLayout;
