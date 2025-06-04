import type { OnChange } from "@monaco-editor/react";

export type CodeEditorProps = {
  readOnly?: boolean;
  value?: string;
  onChange?: OnChange;
  language: string;
};
