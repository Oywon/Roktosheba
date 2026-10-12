import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import EmergencyHotline from '../components/EmergencyHotline';
import BloodCenterMap from '../components/BloodCenterMap';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHeader title="RoktoSheba" description="Emergency blood donor network for Savar and nearby communities." />

      <section className="quick-donor-banner">
        <div>
          <h2>I want to donate blood</h2>
          <p>Register in under a minute and help people in Savar find a match when they need it most.</p>
        </div>
        <Link className="primary-button quick-donor-button" to="/register?source=quick-donor">Become a donor</Link>
      </section>

      <EmergencyHotline />
      <BloodCenterMap />

      <section className="home-grid" aria-label="Explore RoktoSheba">
        <Link className="home-card home-card-find" to="/find">
          <span className="home-card-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="21" cy="21" r="12" />
              <path d="m30 30 9 9M16 21h10m-5-5v10" />
            </svg>
          </span>
          <h2>{t('nav.find')}</h2>
          <p>Search by blood group and Savar area for safe, privacy-aware donor matches.</p>
          <span className="home-card-action">Find a match <span aria-hidden="true">→</span></span>
        </Link>
        <Link className="home-card home-card-register" to="/register?source=quick-donor">
          <span className="home-card-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M24 41s-15-9-15-21a8 8 0 0 1 15-4 8 8 0 0 1 15 4c0 12-15 21-15 21Z" />
              <path d="M24 18v13m-6.5-6.5h13" />
            </svg>
          </span>
          <h2>{t('nav.register')}</h2>
          <p>Join the donor community and help someone get the blood they need.</p>
          <span className="home-card-action">Become a donor <span aria-hidden="true">→</span></span>
        </Link>
        <Link className="home-card home-card-request" to="/requests">
          <span className="home-card-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M8 12h32v23H21l-9 7v-7H8V12Z" />
              <path d="M24 17c-2.5 3.3-4 5.1-4 7a4 4 0 0 0 8 0c0-1.9-1.5-3.7-4-7Z" />
            </svg>
          </span>
          <h2>{t('nav.requests')}</h2>
          <p>Share an urgent blood need or find someone who needs your help.</p>
          <span className="home-card-action">View requests <span aria-hidden="true">→</span></span>
        </Link>
        <Link className="home-card home-card-orgs" to="/organizations">
          <span className="home-card-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M8 40V16l16-8 16 8v24H8Z" />
              <path d="M18 40V27h12v13M17 18h.01M24 18h.01M31 18h.01M17 23h.01M31 23h.01" />
            </svg>
          </span>
          <h2>{t('nav.orgs')}</h2>
          <p>Discover trusted blood donation organizations across Bangladesh.</p>
          <span className="home-card-action">Meet our partners <span aria-hidden="true">→</span></span>
        </Link>
      </section>
    </div>
  );
}
