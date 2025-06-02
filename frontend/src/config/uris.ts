const BASE_URL = "http://localhost:5000/api";

// HTML Cleaner
const HTML_CLEANER_SVC_PREFIX = "/gdoc_html_cleaner";
const CLEAN = "/clean";
const CLEAN_FILE = "/clean-file";
export const HTML_CLEANER_SVC_CLEAN_URI =
  BASE_URL + HTML_CLEANER_SVC_PREFIX + CLEAN;
export const HTML_CLEANER_SVC_CLEAN_FILE_URI =
  BASE_URL + HTML_CLEANER_SVC_PREFIX + CLEAN_FILE;
