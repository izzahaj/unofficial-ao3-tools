import { Menu } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  return (
    // <Box position="sticky" sx={{ flexGrow: 1, p: 0, m: 0 }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Unofficial Tools
          </Typography>
          <IconButton
            size="large"
            edge="end"
          >
            <Menu/>
          </IconButton>
        </Toolbar>
      </AppBar>
    // </Box>
  );
}

export default Navbar;