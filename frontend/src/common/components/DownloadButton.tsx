import { Download } from "@mui/icons-material";
import { Button, type ButtonProps } from "@mui/material";

type DownloadBUttonProps = ButtonProps & {};

const DownloadButton: React.FC<DownloadBUttonProps> = (props) => {
  const { ...buttonProps } = props;

  return <Button startIcon={<Download />} {...buttonProps}></Button>;
};

export default DownloadButton;
