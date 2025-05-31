import { Box, Typography } from "@mui/material"

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "orange", display: "flex", flex: 1, justifyContent: "center"}}>
      <Typography>
        © {new Date().getFullYear()} Unofficial AO3 Tools. Open source under the MIT License.
      </Typography>
    </Box>
  );
}

export default Footer;
