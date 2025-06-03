import { FormProvider as Form, type UseFormReturn } from "react-hook-form";

// -------------------------------------------------------------------------------------------------

type FormProviderProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

const FormProvider = ({ children, onSubmit, methods }: FormProviderProps) => {
  return (
    <Form {...methods}>
      <form noValidate onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
};

export default FormProvider;
