import "./App.css";

import { Route, Routes } from "react-router";

import MainLayout from "./common/layout/MainLayout";
import GoogleDocsHtmlCleanerPage from "./pages/GoogleDocsHtmlCleanerPage";
import HomePage from "./pages/HomePage";

function App () {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/google-docs-html-cleaner" element={<GoogleDocsHtmlCleanerPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
