import { FormHelperText, Stack } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import CodeEditor from "../codeEditor/CodeEditor";
import type { CodeEditorProps } from "../codeEditor/CodeEditor.types";

type RHFCodeEditorProps = Omit<CodeEditorProps, "value"> & {
  name: string;
};

const RHFCodeEditor: React.FC<RHFCodeEditorProps> = (props) => {
  const { name, ...others } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack rowGap={1} sx={{ flex: 1 }}>
          <CodeEditor
            value={field.value}
            onChange={(value, _e) => field.onChange(value ?? "")}
            {...others}
          />
          {error && (
            <FormHelperText error={!!error}>{error?.message}</FormHelperText>
          )}
        </Stack>
      )}
    />
  );
};

export default RHFCodeEditor;
