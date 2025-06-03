import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

import CopyButton from "../common/components/buttons/CopyButton";
import DownloadButton from "../common/components/buttons/DownloadButton";
import ClearEditorButton from "../common/components/codeEditor/ClearEditorButton";
import CodeEditor from "../common/components/codeEditor/CodeEditor";
import FormProvider from "../common/components/hookForm/FormProvider";
import RHFCodeEditor from "../common/components/hookForm/RHFCodeEditor";
import RHFFileUploadButton from "../common/components/hookForm/RHFFileUploadButton";
import RHFTextField from "../common/components/hookForm/RHFTextField";
import TabPanel from "../common/components/TabPanel";
import {
  HOVER_TRANSLATION_SVC_GENERATE_FILE_URI,
  HOVER_TRANSLATION_SVC_GENERATE_URI,
} from "../config/uris";
import EditorTabLabel from "../features/HoverTranslation/components/EditorTabLabel";
import FileUploadTabLabel from "../features/HoverTranslation/components/FileUploadTabLabel";
import { hoverTranslationSchema } from "../features/HoverTranslation/schema/HoverTranslationSchema";

const HoverTranslationPage = () => {
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [generatedCss, setGeneratedCss] = useState("");
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetAlerts = () => {
    setOpenSuccessAlert(false);
    setOpenErrorAlert(false);
    setErrorMessage("");
  };

  const resetResultEditors = () => {
    setGeneratedHtml("");
    setGeneratedCss("");
  };

  const defaultValues = {
    mode: "editor",
    chapterId: "",
    html: "",
    file: undefined,
  };

  const methods = useForm({
    resolver: yupResolver(hoverTranslationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { isSubmitting },
  } = methods;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue("mode", newValue);
  };

  const isTabDisabled = (value: string) => {
    return isSubmitting && watch("mode") != value;
  };

  const handleGenerateFromString = async (html: string, chapterId: string) => {
    const url = HOVER_TRANSLATION_SVC_GENERATE_URI;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const submittedData = { html, chapterId };

    const response = await axios.post(url, submittedData, config);
    return response.data;
  };

  const handleGenerateFromFile = async (file: File, chapterId: string) => {
    const url = HOVER_TRANSLATION_SVC_GENERATE_FILE_URI;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chapterId", chapterId);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(url, formData, config);

    return response.data;
  };

  const onSubmit = handleSubmit(async (data) => {
    resetAlerts();
    resetResultEditors();

    const { html, file, chapterId, mode } = data;
    let submittedData;

    try {
      if (mode === "editor" && html) {
        submittedData = await handleGenerateFromString(html, chapterId);
      } else if (mode === "upload" && file) {
        submittedData = await handleGenerateFromFile(file, chapterId);
      } else {
        throw Error("Something went wrong! Please try again later.");
      }

      const { html: newHtml, css: newCss } = submittedData;

      setGeneratedHtml(newHtml);
      setGeneratedCss(newCss);
      setOpenSuccessAlert(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errMessage = err.response?.data.error;
        const status = err.response?.status;

        if (status === 400) {
          setErrorMessage(errMessage);
        } else {
          setErrorMessage("Something went wrong! Please try again later.");
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong! Please try again later.");
      }
      console.error(err);
      setOpenErrorAlert(true);
    }
  });

  return (
    <>
      <Stack rowGap={2} direction="column" sx={{ width: "100%", p: 0, m: 0 }}>
        <Typography variant="h5" fontWeight="bold">
          Hover Translation Generator
        </Typography>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack>
            <Box>
              <Tabs
                value={watch("mode")}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  value="editor"
                  label={<EditorTabLabel />}
                  disabled={isTabDisabled("editor")}
                />
                <Tab
                  value="upload"
                  label={<FileUploadTabLabel />}
                  disabled={isTabDisabled("upload")}
                />
              </Tabs>
            </Box>
            <TabPanel
              value={watch("mode")}
              name="editor"
              sx={{ p: 2, display: "flex", flexDirection: "column" }}
            >
              <Stack rowGap={1} sx={{ flex: 1, minHeight: "75vh" }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    alignSelf="flex-start"
                  >
                    Type or paste HTML into the editor
                  </Typography>
                  <Stack direction="row" columnGap={0.5} alignSelf="flex-end">
                    <CopyButton
                      variant="contained"
                      size="small"
                      textToCopy={watch("html") ?? defaultValues.html}
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
            </TabPanel>
            <TabPanel
              value={watch("mode")}
              name="upload"
              sx={{ p: 2, display: "flex", flexDirection: "column" }}
            >
              <Stack rowGap={1} sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  alignSelf="flex-start"
                >
                  Upload your fic's HTML file
                </Typography>
                <RHFFileUploadButton
                  name="file"
                  variant="contained"
                  size="small"
                  accept=".html"
                  disabled={isSubmitting}
                />
              </Stack>
            </TabPanel>
          </Stack>
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
              size="medium"
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
              color="secondary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Generate Files
            </Button>
          </Box>
          {openSuccessAlert && (
            <Alert
              severity="success"
              color="success"
              variant="standard"
              onClose={() => setOpenSuccessAlert(false)}
            >
              HTML and CSS files generated successfully!
            </Alert>
          )}
          {openErrorAlert && (
            <Alert
              severity="error"
              color="error"
              variant="standard"
              onClose={() => setOpenErrorAlert(false)}
            >
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}
        </FormProvider>
        <Stack direction={{ xs: "column", lg: "row" }}>
          <Stack rowGap={1} sx={{ p: 2, flex: 1, minHeight: "75vh" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
                Result (HTML)
              </Typography>
              <Stack direction="row" columnGap={0.5} alignSelf="flex-end">
                <CopyButton
                  variant="contained"
                  size="small"
                  textToCopy={generatedHtml}
                />
                <DownloadButton
                  variant="contained"
                  size="small"
                  content={generatedHtml}
                  fileName="hover_translation.html"
                  mimeType="text/html"
                />
              </Stack>
            </Stack>
            <CodeEditor readOnly={true} value={generatedHtml} language="html" />
          </Stack>
          <Stack rowGap={1} sx={{ p: 2, flex: 1, minHeight: "75vh" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
                Result (CSS)
              </Typography>
              <Stack direction="row" columnGap={0.5} alignSelf="flex-end">
                <CopyButton
                  variant="contained"
                  size="small"
                  textToCopy={generatedCss}
                />
                <DownloadButton
                  variant="contained"
                  size="small"
                  content={generatedCss}
                  fileName="hover_translation.css"
                  mimeType="text/css"
                />
              </Stack>
            </Stack>
            <CodeEditor readOnly={true} value={generatedCss} language="css" />
          </Stack>
        </Stack>
        {/* TODO: Add info section */}
      </Stack>
    </>
  );
};

export default HoverTranslationPage;
