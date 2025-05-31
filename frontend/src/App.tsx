import { Route, Routes } from 'react-router'
import './App.css'
import { GoogleDocsHtmlCleanerPage, HomePage } from './pages'
import { MainLayout } from './common/layout'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/google-docs-html-cleaner" element={<GoogleDocsHtmlCleanerPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
