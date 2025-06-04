import Editor from "@monaco-editor/react";
import { Box, Skeleton } from "@mui/material";

import type { CodeEditorProps } from "./CodeEditor.types";

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const { readOnly = false, value, onChange, language } = props;

  const options = {
    scrollBeyondLastLine: false,
    fontSize: 14,
    minimap: { enabled: false },
    padding: {
      top: 8,
      bottom: 8,
    },
    automaticLayout: true,
    readOnly,
  };

  return (
    <Box sx={{ overflow: "hidden", flex: 1, borderRadius: 1 }}>
      <Editor
        options={options}
        defaultLanguage="html"
        language={language}
        width="100%"
        height="100%"
        theme="vs-dark"
        loading={<Skeleton variant="rectangular" height="100%" />}
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default CodeEditor;
