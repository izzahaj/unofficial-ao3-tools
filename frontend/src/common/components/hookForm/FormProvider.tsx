import { Box, type BoxProps } from "@mui/material";
import { FormProvider as Form, type UseFormReturn } from "react-hook-form";

// -------------------------------------------------------------------------------------------------

type FormProviderProps = BoxProps & {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

const FormProvider = ({
  children,
  onSubmit,
  methods,
  ...boxProps
}: FormProviderProps) => {
  return (
    <Form {...methods}>
      <Box component="form" noValidate onSubmit={onSubmit} {...boxProps}>
        {children}
      </Box>
    </Form>
  );
};

export default FormProvider;
