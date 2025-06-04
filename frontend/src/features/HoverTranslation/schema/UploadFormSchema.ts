import * as Yup from "yup";

export const uploadFormSchema = Yup.object().shape({
  chapterId: Yup.string()
    .required("Chapter ID is required")
    .matches(/^[a-zA-Z0-9]+$/, "Chapter ID must be alphanumeric")
    .max(12, "Chapter ID must be at most 12 characters"),
  files: Yup.array()
    .required()
    .of(
      Yup.mixed<File>()
        .required("File is required")
        .test("is-html", "Only HTML files are allowed", (file) =>
          file ? file.name.endsWith(".html") : false,
        ),
    )
    .min(1, "File is required")
    .max(1, "Only one file is allowed"),
});
