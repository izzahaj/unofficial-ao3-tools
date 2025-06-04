import { FormHelperText, Stack } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import FileUploadButton from "../fileUpload/FileUploadButton";
import type { FileUploadButtonProps } from "../fileUpload/FileUploadButton.types";

type RHFFileUploadButtonProps = Omit<FileUploadButtonProps, "onFileSelect"> & {
  name: string;
};

const RHFFileUploadButton: React.FC<RHFFileUploadButtonProps> = (props) => {
  const { name, children, ...other } = props;
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const arrayError = errors?.[name];
  const errorMessage = Array.isArray(arrayError)
    ? arrayError[0]?.message
    : arrayError?.message;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Stack rowGap={1}>
          <FileUploadButton
            files={value}
            onFileSelect={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              onChange(files);
            }}
            {...other}
          >
            {children}
          </FileUploadButton>
          {errorMessage && (
            <FormHelperText error={!!errorMessage}>
              {errorMessage}
            </FormHelperText>
          )}
        </Stack>
      )}
    />
  );
};

export default RHFFileUploadButton;
