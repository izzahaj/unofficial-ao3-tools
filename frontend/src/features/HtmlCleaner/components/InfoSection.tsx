import { List, ListItem, Stack, Typography } from "@mui/material";

// TODO: Add a link to user guide
// Perhaps make this section collapsible and render the user-guide.md directly
const InfoSection = () => {
  return (
    <Stack rowGap={1}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        What does this tool do?
      </Typography>
      <Typography variant="h6" gutterBottom>
        <strong>Google Docs → AO3, minus the mess</strong>
      </Typography>
      <Typography component="p">
        When you paste content from Google Docs into AO3’s Rich Text Editor, you
        might notice weird extra spacing, especially around italicised text.
        That’s because Google Docs wraps styled text in complex{" "}
        <code>&lt;span&gt;</code> tags and inline styles that don’t play well
        with AO3.
      </Typography>
      <Typography component="p">
        This tool cleans up the HTML exported from Google Docs and transforms it
        into a simplified, AO3-friendly version.
      </Typography>
      <Typography component="p">
        Here's what the cleaner does:
        <List dense sx={{ listStyleType: "disc", pl: 4 }}>
          <ListItem sx={{ display: "list-item" }}>
            Preserves basic inline formatting: <strong>bold</strong>,{" "}
            <em>italics</em>, <u>underline</u>, and <s>strikethrough</s>,
            converting them into their semantic HTML tags (
            <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, etc.)
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Retains paragraph alignment (left, right, center, justify)
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Other formatting (e.g. lists, headings, images, indentation, etc.)
            is not supported
          </ListItem>
        </List>
      </Typography>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Important: Only Use Google Docs HTML
      </Typography>
      <Typography component="p">
        This tool is built specifically for{" "}
        <strong>HTML exported from Google Docs.</strong>
      </Typography>
      <Typography component="p" color="error">
        <strong>DO NOT:</strong>
        <List dense sx={{ listStyleType: "disc", pl: 4 }}>
          <ListItem sx={{ display: "list-item" }}>
            <strong>Edit the exported HTML</strong>
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            <strong>Use HTML from other sources</strong>
          </ListItem>
        </List>
        as the structure will be different and might not clean correctly.
      </Typography>
      <Typography component="p">
        To export your HTML from Google Docs:
        <List dense sx={{ listStyleType: "decimal", pl: 4 }}>
          <ListItem sx={{ display: "list-item" }}>
            Go to your Google Doc
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Click <strong>File → Download → Web Page (.html, zipped)</strong>
          </ListItem>
          <ListItem sx={{ display: "list-item" }}>
            Extract the <code>.zip</code> file and open the <code>.html</code>{" "}
            file inside
          </ListItem>
        </List>
      </Typography>
    </Stack>
  );
};

export default InfoSection;
