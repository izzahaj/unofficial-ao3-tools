import Editor, { type OnChange } from "@monaco-editor/react";
import { Skeleton } from "@mui/material";

type CodeEditorProps = {
  readOnly?: boolean;
  value: string;
  onChange?: OnChange;
  language: string;
};

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
  );
};

export default CodeEditor;
