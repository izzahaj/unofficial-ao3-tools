import { Download } from "@mui/icons-material";
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
import type { editor } from "monaco-editor";
import { useState } from "react";

import ClearEditorButton from "../common/components/ClearEditorButton";
import CopyButton from "../common/components/CopyButton";
import FileUploadButton from "../common/components/FileUploadButton";
import TabPanel from "../common/components/TabPanel";
import {
  HTML_CLEANER_SVC_CLEAN_FILE_URI,
  HTML_CLEANER_SVC_CLEAN_URI,
} from "../config/uris";
import EditorTabLabel from "../features/HtmlCleaner/components/EditorTabLabel";
import FileUploadTabLabel from "../features/HtmlCleaner/components/FileUploadTabLabel";
import HtmlEditor from "../features/HtmlCleaner/components/HtmlEditor";
import InfoSection from "../features/HtmlCleaner/components/InfoSection";

const GoogleDocsHtmlCleanerPage = () => {
  const [tabValue, setTabValue] = useState("editor");
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [editorContent, setEditorContent] = useState("");
  const [cleanedHtml, setCleanedHtml] = useState("");
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEditorChange = (
    value: string | undefined,
    _event: editor.IModelContentChangedEvent,
  ) => {
    setEditorContent(value || "");
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFile(event.target.files?.[0]);
  };

  const resetAlerts = () => {
    setOpenSuccessAlert(false);
    setOpenErrorAlert(false);
    setErrorMessage("");
  };

  const handleCleanHtmlString = async () => {
    const url = HTML_CLEANER_SVC_CLEAN_URI;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = { html: editorContent };

    const response = await axios.post(url, data, config);
    return response.data.cleanedHtml;
  };

  const handleCleanFile = async () => {
    if (!uploadedFile) {
      throw new Error("No file selected. Please upload a file first.");
    }

    const url = HTML_CLEANER_SVC_CLEAN_FILE_URI;
    const formData = new FormData();
    formData.append("file", uploadedFile);

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.cleanedHtml;
  };

  const handleClean = async (_event: React.MouseEvent<HTMLButtonElement>) => {
    resetAlerts();

    try {
      let cleaned: string;

      if (tabValue === "editor") {
        cleaned = await handleCleanHtmlString();
      } else {
        cleaned = await handleCleanFile();
      }

      setCleanedHtml(cleaned);
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
        // TODO: Come up with a better way to catch no file uploaded error
        // perhaps with react hook form + yup validation?
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong! Please try again later.");
      }
      console.error(err);
      setOpenErrorAlert(true);
    }
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
              <Tab value="editor" label={<EditorTabLabel />} />
              <Tab value="upload" label={<FileUploadTabLabel />} />
            </Tabs>
          </Box>
          <TabPanel
            value={tabValue}
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
                    textToCopy={editorContent}
                  />
                  <ClearEditorButton
                    variant="contained"
                    size="small"
                    setValue={setEditorContent}
                  />
                </Stack>
              </Stack>
              <Box sx={{ overflow: "hidden", flex: 1, borderRadius: 1 }}>
                <HtmlEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                />
              </Box>
            </Stack>
          </TabPanel>
          <TabPanel
            value={tabValue}
            name="upload"
            sx={{ p: 2, display: "flex", flexDirection: "column" }}
          >
            <Stack rowGap={1} sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
                Upload a HTML file exported from Google Docs
              </Typography>
              <FileUploadButton
                variant="contained"
                size="small"
                accept=".html"
                onFileSelect={handleFileUpload}
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
          <Button variant="contained" color="secondary" onClick={handleClean}>
            Clean
          </Button>
        </Box>
        {openSuccessAlert && (
          <Alert
            severity="success"
            color="success"
            variant="standard"
            onClose={() => setOpenSuccessAlert(false)}
          >
            HTML Cleaned successfully!
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
                textToCopy={cleanedHtml}
              />
              <Button variant="contained" size="small" startIcon={<Download />}>
                Download
              </Button>
            </Stack>
          </Stack>
          <Box sx={{ overflow: "hidden", flex: 1, borderRadius: 1 }}>
            <HtmlEditor readOnly={true} value={cleanedHtml} />
          </Box>
        </Stack>
        <InfoSection />
      </Stack>
    </>
  );
};

export default GoogleDocsHtmlCleanerPage;
