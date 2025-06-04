import * as Yup from "yup";

export const editorFormSchema = Yup.object().shape({
  html: Yup.string()
    .required("HTML is required")
    .test("non-empty", "HTML cannot be empty", (val) => !!val?.trim()),
});
