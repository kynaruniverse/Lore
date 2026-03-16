import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './components/ui/Toast'
import { PageTransition } from './components/ui/PageTransition'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import Layout from './components/Layout'
import Home from './pages/Home'
import Home3D from './pages/Home3D'
import Search from './pages/Search'
import CreateLore from './pages/CreateLore'
import LoreHub from './pages/LoreHub'
import PageView from './pages/PageView'
import CreatePage from './pages/CreatePage'
import EditPage from './pages/EditPage'
import GraphView from './pages/GraphView'
import NotFound from './pages/NotFound'
import './index.css'

// Component to initialize all hooks
function AppHooks() {
  useSmoothScroll()
  useKeyboardNav()
  return null
}

// Wrapper for pages that need transitions
function TransitionLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <PageTransition>
        {children}
      </PageTransition>
    </Layout>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" switchable>
      <ToastProvider>
        <BrowserRouter>
          <AppHooks />
          <Routes>
            {/* 3D experimental home - no layout, full screen */}
            <Route path="/3d" element={<Home3D />} />
            
            {/* Regular routes with layout and transitions */}
            <Route path="/" element={
              <TransitionLayout>
                <Home />
              </TransitionLayout>
            } />
            <Route path="/search" element={
              <TransitionLayout>
                <Search />
              </TransitionLayout>
            } />
            <Route path="/create" element={
              <TransitionLayout>
                <CreateLore />
              </TransitionLayout>
            } />
            <Route path="/lore/:loreSlug" element={
              <TransitionLayout>
                <LoreHub />
              </TransitionLayout>
            } />
            <Route path="/lore/:loreSlug/:pageSlug" element={
              <TransitionLayout>
                <PageView />
              </TransitionLayout>
            } />
            <Route path="/lore/:loreSlug/create-page" element={
              <TransitionLayout>
                <CreatePage />
              </TransitionLayout>
            } />
            <Route path="/lore/:loreSlug/:pageSlug/edit" element={
              <TransitionLayout>
                <EditPage />
              </TransitionLayout>
            } />
            <Route path="/lore/:loreSlug/graph" element={
              <TransitionLayout>
                <GraphView />
              </TransitionLayout>
            } />
            <Route path="*" element={
              <TransitionLayout>
                <NotFound />
              </TransitionLayout>
            } />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
