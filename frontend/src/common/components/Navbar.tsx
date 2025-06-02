import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar variant="dense">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Unofficial Tools
        </Typography>
        <IconButton size="large" edge="end">
          <Menu />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
