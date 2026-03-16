import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import CreateLore from './pages/CreateLore'
import LoreHub from './pages/LoreHub'
import PageView from './pages/PageView'
import CreatePage from './pages/CreatePage'
import EditPage from './pages/EditPage'
import GraphView from './pages/GraphView'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/create" element={<Layout><CreateLore /></Layout>} />
          <Route path="/lore/:loreSlug" element={<Layout><LoreHub /></Layout>} />
          <Route path="/lore/:loreSlug/:pageSlug" element={<Layout><PageView /></Layout>} />
          <Route path="/lore/:loreSlug/create-page" element={<Layout><CreatePage /></Layout>} />
          <Route path="/lore/:loreSlug/:pageSlug/edit" element={<Layout><EditPage /></Layout>} />
          <Route path="/lore/:loreSlug/graph" element={<Layout><GraphView /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
