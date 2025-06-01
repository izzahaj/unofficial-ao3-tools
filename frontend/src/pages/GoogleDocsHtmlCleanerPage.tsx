import { Clear, CloudUpload, ContentCopy, Download } from "@mui/icons-material";
import { Box, Button, List, ListItem, Stack, styled, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import TabPanel from "../common/components/TabPanel";
import EditorTabLabel from "../features/HtmlCleaner/components/EditorTabLabel";
import FileUploadTabLabel from "../features/HtmlCleaner/components/FileUploadTabLabel";
import HtmlEditor from "../features/HtmlCleaner/components/HtmlEditor";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const GoogleDocsHtmlCleanerPage = () => {
  const [value, setValue] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File>();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    setUploadedFile(event.target.files?.[0]);
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
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab label={<EditorTabLabel />} />
              <Tab label={<FileUploadTabLabel />} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0} sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Stack rowGap={1} sx={{ flex: 1, minHeight: "75vh" }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
                  Type or paste HTML into the editor
                </Typography>
                <Stack direction="row" columnGap={0.5} alignSelf="flex-end">
                  <Button variant="contained" size="small" startIcon={<ContentCopy />}>
                    Copy
                  </Button>
                  <Button variant="contained" size="small" color="error" startIcon={<Clear />}>
                    Clear
                  </Button>
                </Stack>
              </Stack>
              <Box sx={{ overflow: "hidden", flex: 1, borderRadius: 1 }}>
                <HtmlEditor />
              </Box>
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1} sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Stack rowGap={1} sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">
                Upload a HTML file exported from Google Docs
              </Typography>
              <Stack columnGap={1} direction="row" sx={{ alignItems: "center" }}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUpload />}
                  size="small"
                >
                  Choose file
                  <VisuallyHiddenInput
                    type="file"
                    accept=".html"
                    onChange={handleFileUpload}
                    multiple
                  />
                </Button>
                <Box flex={1} textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                  {uploadedFile?.name || "No file chosen"}
                </Box>
              </Stack>
            </Stack>
          </TabPanel>
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button variant="contained" color="secondary">Clean</Button>
        </Box>
        <Stack rowGap={1} sx={{ p: 2, flex: 1, minHeight: "75vh" }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold" alignSelf="flex-start">Result</Typography>
            <Stack direction="row" columnGap={0.5} alignSelf="flex-end">
              <Button variant="contained" size="small" startIcon={<ContentCopy />}>
                Copy
              </Button>
              <Button variant="contained" size="small" startIcon={<Download />}>
                Download
              </Button>
            </Stack>
          </Stack>
          <Box sx={{ overflow: "hidden", flex: 1, borderRadius: 1 }}>
            <HtmlEditor readOnly={true} />
          </Box>
        </Stack>
        <Stack rowGap={1}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            What does this tool do?
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Google Docs → AO3, minus the mess</strong>
          </Typography>
          <Typography component="p" >
            When you paste content from Google Docs into AO3’s Rich Text Editor, you might notice
            weird extra spacing, especially around italicised text. That’s because Google Docs
            wraps styled text in complex <code>&lt;span&gt;</code> tags and inline styles that
            don’t play well with AO3.
          </Typography>
          <Typography component="p">
            This tool cleans up the HTML exported from Google Docs and transforms it into a
            simplified, AO3-friendly version.
          </Typography>
          <Typography component="p">
            Here's what the cleaner does:
          </Typography>
          <List dense sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              Preserves basic inline formatting: <strong>bold</strong>, <em>italics</em>
              , <u>underline</u>, and <s>strikethrough</s>, converting them into their semantic
              HTML tags (<code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, etc.)
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Retains paragraph alignment (left, right, center, justify)
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Other formatting (e.g. lists, headings, images, indentation, etc.) is not supported
            </ListItem>
          </List>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Important: Only Use Google Docs HTML
          </Typography>
          <Typography component="p">
            This tool is built <strong>specifically</strong> for HTML exported from Google Docs.
          </Typography>
          <Typography component="p" color="error">
            <strong>Do not paste HTML from other sources</strong> as the structure will be
            different and might not clean correctly.
          </Typography>
          <Typography component="p">
            To export your HTML from Google Docs:
          </Typography>
          <List dense sx={{ listStyleType: "decimal", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              Go to your Google Doc
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Click <strong>File → Download → Web Page (.html, zipped)</strong>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Extract the <code>.zip</code> file and open the <code>.html</code> file inside
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </>
  );
};

export default GoogleDocsHtmlCleanerPage;
