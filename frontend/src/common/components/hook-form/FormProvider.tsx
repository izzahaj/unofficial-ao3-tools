import {
  type FieldValues,
  FormProvider as Form,
  type UseFormReturn,
} from "react-hook-form";

// -------------------------------------------------------------------------------------------------

type FormProviderProps<T extends FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

const FormProvider = <T extends FieldValues>({
  children,
  onSubmit,
  methods,
}: FormProviderProps<T>) => {
  return (
    <Form {...methods}>
      <form noValidate onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
};

export default FormProvider;
