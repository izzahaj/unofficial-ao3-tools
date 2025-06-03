import { FormHelperText, Stack } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import FileUploadButton from "../fileUpload/FileUploadButton";
import type { FileUploadButtonProps } from "../fileUpload/FileUploadButton.types";

type RHFFileUploadButtonProps = Omit<FileUploadButtonProps, "onFileSelect"> & {
  name: string;
};

const RHFFileUploadButton: React.FC<RHFFileUploadButtonProps> = (props) => {
  const { name, children, ...other } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack rowGap={1}>
          <FileUploadButton
            {...field}
            files={field.value ?? []}
            onFileSelect={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              field.onChange(files);
            }}
            {...other}
          >
            {children}
          </FileUploadButton>
          {error && (
            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
          )}
        </Stack>
      )}
    />
  );
};

export default RHFFileUploadButton;
