import { UploadFile } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

const FileUploadTabLabel = () => {
  return (
    <Stack direction="row" columnGap={1} alignItems="center">
      <UploadFile />
      <Typography variant="body1">Upload</Typography>
    </Stack>
  );
}

export default FileUploadTabLabel;
