import { Clear } from "@mui/icons-material";
import { Button, type ButtonProps } from "@mui/material";

type ClearEditorButtonProps = ButtonProps & {
  setValue: (value: React.SetStateAction<string>) => void;
};

const ClearEditorButton: React.FC<ClearEditorButtonProps> = (props) => {
  const {
    setValue,
    color = "error",
    children = "Clear",
    ...buttonProps
  } = props;

  const handleClear = () => {
    setValue("");
  };

  return (
    <Button
      startIcon={<Clear />}
      color={color}
      onClick={handleClear}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default ClearEditorButton;
