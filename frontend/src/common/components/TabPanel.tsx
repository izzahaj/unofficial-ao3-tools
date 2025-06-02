import { Box, type BoxProps } from "@mui/material";

type TabPanelProps = BoxProps & {
  children?: React.ReactNode;
  name: string;
  value: string;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, name, ...other } = props;

  return <>{value === name && <Box {...other}>{children}</Box>}</>;
};

export default TabPanel;
