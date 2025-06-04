import { Clear } from "@mui/icons-material";
import { Button, type ButtonProps } from "@mui/material";

type ClearEditorButtonProps = ButtonProps & {
  children?: React.ReactNode;
};

const ClearEditorButton: React.FC<ClearEditorButtonProps> = (props) => {
  const { color = "error", children = "Clear", ...buttonProps } = props;

  return (
    <Button startIcon={<Clear />} color={color} {...buttonProps}>
      {children}
    </Button>
  );
};

export default ClearEditorButton;
