import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
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
      <Route path="/create"                            element={<ProtectedRoute><Layout><CreateLore /></Layout></ProtectedRoute>} />
      <Route path="/lore/:loreSlug"                    element={<Layout><LoreHub /></Layout>} />
      <Route path="/lore/:loreSlug/edit"               element={<ProtectedRoute><Layout><EditLore /></Layout></ProtectedRoute>} />
      <Route path="/lore/:loreSlug/graph"              element={<Layout><GraphView /></Layout>} />
      <Route path="/lore/:loreSlug/create-page"        element={<ProtectedRoute><Layout><CreatePage /></Layout></ProtectedRoute>} />
      {/* PageView renders its own header/layout for a custom back-link */}
      <Route path="/lore/:loreSlug/:pageSlug"          element={<PageView />} />
      <Route path="/lore/:loreSlug/:pageSlug/edit"     element={<ProtectedRoute><Layout><EditPage /></Layout></ProtectedRoute>} />
      <Route path="/login"                              element={<Layout><LoginPage /></Layout>} />
      <Route path="*"                                  element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a proper loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
