import { Download } from "@mui/icons-material";
import { Button, type ButtonProps } from "@mui/material";

type DownloadButtonProps = ButtonProps & {
  content: string;
  fileName: string;
  mimeType: string;
  children?: React.ReactNode;
};

const DownloadButton: React.FC<DownloadButtonProps> = (props) => {
  const {
    content,
    fileName,
    mimeType,
    children = "Download",
    ...buttonProps
  } = props;

  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  return (
    <Button startIcon={<Download />} onClick={handleDownload} {...buttonProps}>
      {children}
    </Button>
  );
};

export default DownloadButton;
