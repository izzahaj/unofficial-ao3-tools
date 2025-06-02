import { CloudUpload } from "@mui/icons-material";
import {
  Button,
  type ButtonProps,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type FileUploadButtonProps = ButtonProps & {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const FileUploadButton: React.FC<FileUploadButtonProps> = (props) => {
  const {
    onFileSelect,
    accept,
    multiple = false,
    children = "Choose file",
    inputProps,
    ...buttonProps
  } = props;

  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files || []));
    onFileSelect(event);
  };

  return (
    <Stack columnGap={1} direction="row" sx={{ alignItems: "center" }}>
      <Button
        component="label"
        role="button"
        tabIndex={-1}
        startIcon={<CloudUpload />}
        {...buttonProps}
      >
        {children}
        <VisuallyHiddenInput
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          multiple={multiple}
          {...inputProps}
        />
      </Button>
      <Stack flex={1} overflow="hidden" whiteSpace="nowrap">
        {files.length > 0 ? (
          files.map((file) => (
            <Typography
              key={file.name}
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {file.name}
            </Typography>
          ))
        ) : (
          <Typography textOverflow="ellipsis" overflow="hidden">
            No file chosen
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default FileUploadButton;
