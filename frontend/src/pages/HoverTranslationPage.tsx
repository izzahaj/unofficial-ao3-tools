import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import type { editor } from "monaco-editor";
import { useState } from "react";

import ClearEditorButton from "../common/components/ClearEditorButton";
import CodeEditor from "../common/components/CodeEditor";
import CopyButton from "../common/components/CopyButton";
import DownloadButton from "../common/components/DownloadButton";
import FileUploadButton from "../common/components/FileUploadButton";
import TabPanel from "../common/components/TabPanel";
import {
  HOVER_TRANSLATION_SVC_GENERATE_FILE_URI,
  HOVER_TRANSLATION_SVC_GENERATE_URI,
} from "../config/uris";
import EditorTabLabel from "../features/HoverTranslation/components/EditorTabLabel";
import FileUploadTabLabel from "../features/HoverTranslation/components/FileUploadTabLabel";

const HoverTranslationPage = () => {
  const [tabValue, setTabValue] = useState("editor");
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [editorContent, setEditorContent] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [generatedCss, setGeneratedCss] = useState("");
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

  const resetResultEditors = () => {
    setGeneratedHtml("");
    setGeneratedCss("");
  };

  const handleGenerateFromString = async () => {
    const url = HOVER_TRANSLATION_SVC_GENERATE_URI;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = { html: editorContent, chapterId: chapterId };

    const response = await axios.post(url, data, config);
    return response.data;
  };

  const handleGenerateFromFile = async () => {
    if (!uploadedFile) {
      throw new Error("No file selected. Please upload a file first.");
    }

    const url = HOVER_TRANSLATION_SVC_GENERATE_FILE_URI;
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("chapterId", String(chapterId));

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(url, formData, config);

    return response.data;
  };

  const handleGenerate = async () => {
    resetAlerts();
    resetResultEditors();

    try {
      let data; // type?

      if (tabValue === "editor") {
        data = await handleGenerateFromString();
      } else {
        data = await handleGenerateFromFile();
      }

      const { html, css } = data;

      setGeneratedHtml(html);
      setGeneratedCss(css);
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
          Hover Translation Generator
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
                <CodeEditor
                  value={editorContent}
                  onChange={handleEditorChange}
                  language="html"
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
                Upload your fic's HTML file
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
          <TextField
            label="Chapter ID"
            type="text"
            size="medium"
            sx={{ width: "175px" }}
            onChange={(e) => setChapterId(e.target.value)}
            helperText="IDs must be unique within each fic. Chapter numbers recommended."
            required
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
            variant="contained"
            color="secondary"
            onClick={handleGenerate}
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
                  fileName={`hover_translation_${chapterId}.html`}
                  mimeType="text/html"
                />
              </Stack>
            </Stack>
            <Box sx={{ overflow: "hidden", flex: 1, borderRadius: 1 }}>
              <CodeEditor
                readOnly={true}
                value={generatedHtml}
                language="html"
              />
            </Box>
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
                  fileName={`hover_translation_${chapterId}.css`}
                  mimeType="text/css"
                />
              </Stack>
            </Stack>
            <Box sx={{ overflow: "hidden", flex: 1, borderRadius: 1 }}>
              <CodeEditor readOnly={true} value={generatedCss} language="css" />
            </Box>
          </Stack>
        </Stack>
        {/* TODO: Add info section */}
      </Stack>
    </>
  );
};

export default HoverTranslationPage;
