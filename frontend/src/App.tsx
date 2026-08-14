import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FindDonorPage from './pages/FindDonorPage';
import RegisterDonorPage from './pages/RegisterDonorPage';
import RequestsPage from './pages/RequestsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import Logo from './components/Logo';
import LanguageSelector from './components/LanguageSelector';
import ThemeToggle from './components/ThemeToggle';
import { useLanguage } from './context/LanguageContext';

function AppContent() {
  const { t } = useLanguage();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><Logo size={36} /> RoktoSheba</div>
        <nav className="site-nav">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/find">{t('nav.find')}</Link>
          <Link to="/register">{t('nav.register')}</Link>
          <Link to="/requests">{t('nav.requests')}</Link>
          <Link to="/organizations">{t('nav.orgs')}</Link>
        </nav>
        <div className="header-controls">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find" element={<FindDonorPage />} />
          <Route path="/register" element={<RegisterDonorPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
