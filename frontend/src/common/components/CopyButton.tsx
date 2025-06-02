import { ContentCopy } from "@mui/icons-material";
import { Button, type ButtonProps } from "@mui/material";

type CopyButtonProps = ButtonProps & {
  textToCopy: string;
  children?: React.ReactNode;
};

const CopyButton: React.FC<CopyButtonProps> = (props) => {
  const { textToCopy, children = "Copy", ...buttonProps } = props;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
  };

  return (
    <Button startIcon={<ContentCopy />} onClick={handleCopy} {...buttonProps}>
      {children}
    </Button>
  );
};

export default CopyButton;
