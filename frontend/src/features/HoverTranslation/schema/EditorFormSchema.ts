import * as Yup from "yup";

export const editorFormSchema = Yup.object().shape({
  chapterId: Yup.string()
    .required("Chapter ID is required")
    .matches(/^[a-zA-Z0-9]+$/, "Chapter ID must be alphanumeric")
    .max(12, "Chapter ID must be at most 12 characters"),
  html: Yup.string()
    .required("HTML is required")
    .test("non-empty", "HTML cannot be empty", (val) => !!val?.trim()),
});
