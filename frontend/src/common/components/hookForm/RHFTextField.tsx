import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

//* ------------------------------------------------------------------------------------------------

//* Props ------------------------------------------------------------------------------------------
type RHFTextFieldProps = TextFieldProps & {
  name: string;
};

//* FC ---------------------------------------------------------------------------------------------
const RHFTextField: React.FC<RHFTextFieldProps> = ({
  name,
  helperText,
  type,
  ...other
}) => {
  const { control } = useFormContext();

  //* JSX ------------------------------------------------------------------------------------------
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === "number" && field.value === 0 ? "" : field.value}
          onChange={(event) => {
            if (type === "number") {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
};

//* Export -----------------------------------------------------------------------------------------
export default RHFTextField;
