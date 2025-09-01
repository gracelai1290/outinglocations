import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SearchProvider, useSearch } from './contexts/SearchContext'
import { CategoryFilterProvider } from './contexts/CategoryFilterContext'
import { Navigation } from './components/Navigation'
import { Sidebar } from './components/Sidebar'
import { DraggableFilter } from './components/DraggableFilter'
import { MapPage } from './pages/MapPage'
import { CategoryPage } from './pages/CategoryPage'
import { AboutPage } from './pages/AboutPage'
import './App.css'

function AppContent() {
  const { setSearchTerm } = useSearch();
  const location = useLocation();

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'white'
    }}>
      <Navigation onSearch={handleSearch} />
      <Sidebar />
      
      <main style={{ 
        paddingTop: '60px',
        paddingLeft: '250px' 
      }}>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      
      {/* Draggable Filter Popup - Only show on Map page */}
      {location.pathname === '/' && <DraggableFilter />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <SearchProvider>
        <CategoryFilterProvider>
          <AppContent />
        </CategoryFilterProvider>
      </SearchProvider>
    </Router>
  )
}

export default App
