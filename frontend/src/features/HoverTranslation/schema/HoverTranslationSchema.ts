import * as Yup from "yup";

export const hoverTranslationSchema = Yup.object().shape({
  chapterId: Yup.string()
    .required("Chapter ID is required")
    .matches(/^[a-zA-Z0-9]+$/, "Chapter ID must be alphanumeric")
    .max(12, "Chapter ID must be at most 12 characters"),
  html: Yup.string().when("mode", {
    is: "editor",
    then: (schema) =>
      schema
        .required("HTML is required")
        .test("non-empty", "HTML cannot be empty", (val) => !!val?.trim()),
    otherwise: (schema) => schema.strip(),
  }),
  file: Yup.mixed<File>().when("mode", {
    is: "upload",
    then: (schema) =>
      schema
        .required("Please upload a file")
        .test("is-html", "Only HTML files are allowed", (file) =>
          file ? file.name.endsWith(".html") : false,
        ),
    otherwise: (schema) => schema.strip(),
  }),
  mode: Yup.string().required(),
});
