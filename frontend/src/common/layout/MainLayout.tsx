import { Box, Container } from "@mui/material";
import { Footer, Navbar } from "../components";
import { Outlet } from "react-router";

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
