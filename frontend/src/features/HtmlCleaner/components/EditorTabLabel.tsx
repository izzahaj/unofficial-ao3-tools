import { Code } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

const EditorTabLabel = () => {
  return (
    <Stack direction="row" columnGap={1} alignItems="center">
      <Code />
      <Typography variant="body1">HTML Editor</Typography>
    </Stack>
  );
};

export default EditorTabLabel;
