import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import CreateLore from './pages/CreateLore'
import EditLore from './pages/EditLore'
import LoreHub from './pages/LoreHub'
import PageView from './pages/PageView'
import CreatePage from './pages/CreatePage'
import EditPage from './pages/EditPage'
import GraphView from './pages/GraphView'
import NotFound from './pages/NotFound'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import './index.css'

function AppRoutes() {
  useSmoothScroll()
  useKeyboardNav()

  return (
    <Routes>
      <Route path="/"                                  element={<Layout><Home /></Layout>} />
      <Route path="/search"                            element={<Layout><Search /></Layout>} />
      <Route path="/create"                            element={<Layout><CreateLore /></Layout>} />
      <Route path="/lore/:loreSlug"                    element={<Layout><LoreHub /></Layout>} />
      <Route path="/lore/:loreSlug/edit"               element={<Layout><EditLore /></Layout>} />
      <Route path="/lore/:loreSlug/graph"              element={<Layout><GraphView /></Layout>} />
      <Route path="/lore/:loreSlug/create-page"        element={<Layout><CreatePage /></Layout>} />
      {/* PageView renders its own header/layout for a custom back-link */}
      <Route path="/lore/:loreSlug/:pageSlug"          element={<PageView />} />
      <Route path="/lore/:loreSlug/:pageSlug/edit"     element={<Layout><EditPage /></Layout>} />
      <Route path="*"                                  element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
