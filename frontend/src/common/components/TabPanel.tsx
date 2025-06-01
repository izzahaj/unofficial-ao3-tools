import { Box, type BoxProps } from "@mui/material";

type TabPanelProps = BoxProps & {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <>
      {value === index && (
        <Box {...other}>
          {children}
        </Box>
      )}
    </>
  );
};

export default TabPanel;