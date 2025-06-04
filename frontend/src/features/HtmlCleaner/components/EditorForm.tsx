import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import type { UseFormReturn } from "react-hook-form";

import CopyButton from "../../../common/components/buttons/CopyButton";
import ClearEditorButton from "../../../common/components/codeEditor/ClearEditorButton";
import FormProvider from "../../../common/components/hookForm/FormProvider";
import RHFCodeEditor from "../../../common/components/hookForm/RHFCodeEditor";
import { HTML_CLEANER_SVC_CLEAN_URI } from "../../../config/uris";

type EditorFormProps = {
  methods: UseFormReturn<{ html: string }, unknown, { html: string }>;
  resetAlerts: () => void;
  resetResultEditor: () => void;
  handleSuccess: (cleanedHtml: string) => void;
  handleErrors: (err: unknown) => void;
};

const EditorForm: React.FC<EditorFormProps> = (props) => {
  const {
    methods,
    resetAlerts,
    resetResultEditor,
    handleSuccess,
    handleErrors,
  } = props;

  const {
    handleSubmit,
    resetField,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    resetAlerts();
    resetResultEditor();

    const url = HTML_CLEANER_SVC_CLEAN_URI;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(url, data, config);
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
      <Stack rowGap={1} sx={{ flex: 1, minHeight: "75vh" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
        >
          <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
            Type or paste HTML into the editor
          </Typography>
          <Stack direction="row" columnGap={0.5} alignSelf="flex-end">
            <CopyButton
              variant="contained"
              size="small"
              textToCopy={watch("html")}
            />
            <ClearEditorButton
              variant="contained"
              size="small"
              onClick={() => resetField("html")}
            />
          </Stack>
        </Stack>
        <RHFCodeEditor name="html" language="html" />
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

export default EditorForm;
