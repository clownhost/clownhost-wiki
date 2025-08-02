import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import SearchModal from './components/SearchModal/SearchModal';
import { WikiProvider } from './hooks/useWiki';
import { ThemeProvider } from './hooks/useTheme';
import styles from './App.module.css';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.app}>
      <Header
        onSearch={() => setIsSearchOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className={styles.layout}>
        <Sidebar
          isOpen={isSidebarOpen}
          onPageSelect={() => {
            if (window.innerWidth <= 768) {
              setIsSidebarOpen(false);
            }
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/page/welcome" replace />} />
          <Route path="/page/:slug" element={<MainContent isSidebarOpen={isSidebarOpen} />} />
        </Routes>
      </div>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WikiProvider>
        <Router>
          <AppContent />
        </Router>
      </WikiProvider>
    </ThemeProvider>
  );
}

export default App;
