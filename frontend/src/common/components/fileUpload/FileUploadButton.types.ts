import { type ButtonProps } from "@mui/material";

export type FileUploadButtonProps = ButtonProps & {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  files?: File[];
};
