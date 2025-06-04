import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  AlertTitle,
  Box,
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
import CodeEditor from "../common/components/codeEditor/CodeEditor";
import TabPanel from "../common/components/TabPanel";
import EditorForm from "../features/HtmlCleaner/components/EditorForm";
import EditorTabLabel from "../features/HtmlCleaner/components/EditorTabLabel";
import FileUploadTabLabel from "../features/HtmlCleaner/components/FileUploadTabLabel";
import InfoSection from "../features/HtmlCleaner/components/InfoSection";
import UploadForm from "../features/HtmlCleaner/components/UploadForm";
import { editorFormSchema } from "../features/HtmlCleaner/schema/EditorFormSchema";
import { uploadFormSchema } from "../features/HtmlCleaner/schema/UploadFormSchema";

const GoogleDocsHtmlCleanerPage = () => {
  const [tabValue, setTabValue] = useState("editor");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetAlerts = () => {
    setOpenSuccessAlert(false);
    setOpenErrorAlert(false);
    setErrorMessage("");
  };

  const resetResultEditor = () => {
    setGeneratedHtml("");
  };

  const defaultEditorValues = {
    html: "",
  };

  const defaultFileValues = {
    files: [],
  };

  const editorFormMethods = useForm({
    resolver: yupResolver(editorFormSchema),
    defaultValues: defaultEditorValues,
  });

  const uploadFormMethods = useForm({
    resolver: yupResolver(uploadFormSchema),
    defaultValues: defaultFileValues,
  });

  const {
    clearErrors: clearEditorFormErrors,
    formState: { isSubmitting: isEditorFormSubmitting },
  } = editorFormMethods;

  const {
    clearErrors: clearUploadFormErrors,
    formState: { isSubmitting: isFileFormSubmitting },
  } = uploadFormMethods;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    resetAlerts();
    clearEditorFormErrors();
    clearUploadFormErrors();
  };

  const isTabDisabled = (value: string) => {
    return (
      (isEditorFormSubmitting && value !== tabValue) ||
      (isFileFormSubmitting && value !== tabValue)
    );
  };

  const handleSuccess = (cleanedHtml: string) => {
    setGeneratedHtml(cleanedHtml);
    setOpenSuccessAlert(true);
  };

  const handleErrors = (err: unknown) => {
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
  };

  return (
    <>
      <Stack rowGap={2} direction="column" sx={{ width: "100%", p: 0, m: 0 }}>
        <Typography variant="h5" fontWeight="bold">
          Google Docs HTML Cleaner
        </Typography>
        <Stack>
          <Box>
            <Tabs
              value={tabValue}
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
            value={tabValue}
            name="editor"
            sx={{ p: 2, display: "flex", flexDirection: "column" }}
          >
            <EditorForm
              methods={editorFormMethods}
              resetAlerts={resetAlerts}
              resetResultEditor={resetResultEditor}
              handleSuccess={handleSuccess}
              handleErrors={handleErrors}
            />
          </TabPanel>
          <TabPanel
            value={tabValue}
            name="upload"
            sx={{ p: 2, display: "flex", flexDirection: "column" }}
          >
            <UploadForm
              methods={uploadFormMethods}
              resetAlerts={resetAlerts}
              resetResultEditor={resetResultEditor}
              handleSuccess={handleSuccess}
              handleErrors={handleErrors}
            />
          </TabPanel>
        </Stack>
        {openSuccessAlert && (
          <Alert
            severity="success"
            color="success"
            variant="standard"
            onClose={() => setOpenSuccessAlert(false)}
          >
            HTML cleaned successfully!
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
        <Stack rowGap={1} sx={{ p: 2, flex: 1, minHeight: "75vh" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
              Result
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
                fileName="cleaned.html"
                mimeType="text/html"
              />
            </Stack>
          </Stack>
          <CodeEditor readOnly={true} value={generatedHtml} language="html" />
        </Stack>
        <InfoSection />
      </Stack>
    </>
  );
};

export default GoogleDocsHtmlCleanerPage;
