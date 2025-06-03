const BASE_URL = "http://localhost:5000/api";

// HTML Cleaner
const HTML_CLEANER_SVC_PREFIX = "/gdoc-html-cleaner";
const CLEAN = "/clean";
const CLEAN_FILE = "/clean-file";
export const HTML_CLEANER_SVC_CLEAN_URI =
  BASE_URL + HTML_CLEANER_SVC_PREFIX + CLEAN;
export const HTML_CLEANER_SVC_CLEAN_FILE_URI =
  BASE_URL + HTML_CLEANER_SVC_PREFIX + CLEAN_FILE;

// Hover Translation
const HOVER_TRANSLATION_SVC_PREFIX = "/hover-translation";
const GENERATE = "/generate";
const GENERATE_FILE = "/generate-file";
export const HOVER_TRANSLATION_SVC_GENERATE_URI =
  BASE_URL + HOVER_TRANSLATION_SVC_PREFIX + GENERATE;
export const HOVER_TRANSLATION_SVC_GENERATE_FILE_URI =
  BASE_URL + HOVER_TRANSLATION_SVC_PREFIX + GENERATE_FILE;
