import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import type React from "react";
import { type UseFormReturn } from "react-hook-form";

import CopyButton from "../../../common/components/buttons/CopyButton";
import ClearEditorButton from "../../../common/components/codeEditor/ClearEditorButton";
import FormProvider from "../../../common/components/hookForm/FormProvider";
import RHFCodeEditor from "../../../common/components/hookForm/RHFCodeEditor";
import RHFTextField from "../../../common/components/hookForm/RHFTextField";
import { HOVER_TRANSLATION_SVC_GENERATE_URI } from "../../../config/uris";

type EditorFormProps = {
  methods: UseFormReturn<
    {
      chapterId: string;
      html: string;
    },
    unknown,
    {
      chapterId: string;
      html: string;
    }
  >;
  resetAlerts: () => void;
  resetResultEditors: () => void;
  handleSuccess: (html: string, css: string) => void;
  handleErrors: (err: unknown) => void;
};

const EditorForm: React.FC<EditorFormProps> = (props) => {
  const {
    methods,
    resetAlerts,
    resetResultEditors,
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
    resetResultEditors();

    const url = HOVER_TRANSLATION_SVC_GENERATE_URI;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(url, data, config);
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

export default EditorForm;
