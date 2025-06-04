import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import type { UseFormReturn } from "react-hook-form";

import FormProvider from "../../../common/components/hookForm/FormProvider";
import RHFFileUploadButton from "../../../common/components/hookForm/RHFFileUploadButton";
import { HTML_CLEANER_SVC_CLEAN_FILE_URI } from "../../../config/uris";

type UploadFormProps = {
  methods: UseFormReturn<{ files: File[] }, unknown, { files: File[] }>;
  resetAlerts: () => void;
  resetResultEditor: () => void;
  handleSuccess: (cleanedHtml: string) => void;
  handleErrors: (err: unknown) => void;
};

const UploadForm: React.FC<UploadFormProps> = (props) => {
  const {
    methods,
    resetAlerts,
    resetResultEditor,
    handleSuccess,
    handleErrors,
  } = props;

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    resetAlerts();
    resetResultEditor();

    const url = HTML_CLEANER_SVC_CLEAN_FILE_URI;
    const formData = new FormData();

    const { files } = data;

    formData.append("file", files[0]);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(url, formData, config);
      const { cleanedHtml } = response.data;

      handleSuccess(cleanedHtml);
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
          Upload a HTML file exported from Google Docs
        </Typography>
        <RHFFileUploadButton
          name="files"
          variant="contained"
          size="small"
          accept=".html"
          disabled={isSubmitting}
        />
      </Stack>
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
          Clean
        </Button>
      </Box>
    </FormProvider>
  );
};

export default UploadForm;
