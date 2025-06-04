import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import type { UseFormReturn } from "react-hook-form";

import FormProvider from "../../../common/components/hookForm/FormProvider";
import RHFFileUploadButton from "../../../common/components/hookForm/RHFFileUploadButton";
import RHFTextField from "../../../common/components/hookForm/RHFTextField";
import { HOVER_TRANSLATION_SVC_GENERATE_FILE_URI } from "../../../config/uris";

type UploadFormProps = {
  methods: UseFormReturn<
    {
      chapterId: string;
      files: File[];
    },
    unknown,
    {
      chapterId: string;
      files: File[];
    }
  >;
  resetAlerts: () => void;
  resetResultEditors: () => void;
  handleSuccess: (html: string, css: string) => void;
  handleErrors: (err: unknown) => void;
};

const UploadForm: React.FC<UploadFormProps> = (props) => {
  const {
    methods,
    resetAlerts,
    resetResultEditors,
    handleSuccess,
    handleErrors,
  } = props;

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    resetAlerts();
    resetResultEditors();

    const url = HOVER_TRANSLATION_SVC_GENERATE_FILE_URI;
    const formData = new FormData();

    const { chapterId, files } = data;

    formData.append("file", files[0]);
    formData.append("chapterId", chapterId);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(url, formData, config);
      const { html, css } = response.data;

      handleSuccess(html, css);
    } catch (err) {
      handleErrors(err);
    }
  });

  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", flex: 1, rowGap: 3 }}
    >
      <Stack rowGap={1} sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
          Upload your fic's HTML file
        </Typography>
        <RHFFileUploadButton
          name="files"
          variant="contained"
          size="small"
          accept=".html"
          disabled={isSubmitting}
        />
      </Stack>
      <Stack
        rowGap={2}
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "center", sm: "baseline" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RHFTextField
            name="chapterId"
            label="Chapter ID"
            type="text"
            size="small"
            sx={{ width: "175px" }}
            helperText="IDs must be unique within each fic. Chapter numbers recommended."
            slotProps={{ htmlInput: { maxLength: 12 } }}
            required
            disabled={isSubmitting}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="success"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Generate Files
          </Button>
        </Box>
      </Stack>
    </FormProvider>
  );
};

export default UploadForm;
