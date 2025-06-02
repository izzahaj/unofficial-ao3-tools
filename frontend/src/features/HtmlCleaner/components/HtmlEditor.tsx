import Editor, { type OnChange } from "@monaco-editor/react";
import { Skeleton } from "@mui/material";

type HtmlEditorProps = {
  readOnly?: boolean;
  value: string;
  onChange?: OnChange;
};

const HtmlEditor: React.FC<HtmlEditorProps> = ({ readOnly = false, value, onChange }) => {
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
    <Editor
      options={options}
      defaultLanguage="html"
      language="html"
      width="100%"
      height="100%"
      theme="vs-dark"
      loading={<Skeleton variant="rectangular" height="100%" />}
      value={value}
      onChange={onChange}
    />
  );
};

export default HtmlEditor;