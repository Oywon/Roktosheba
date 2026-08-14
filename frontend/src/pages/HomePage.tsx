import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import EmergencyHotline from '../components/EmergencyHotline';
import BloodCenterMap from '../components/BloodCenterMap';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHeader title="RoktoSheba" description="Emergency blood donor network for Bangladesh." />
      
      <EmergencyHotline />
      <BloodCenterMap />
      
      <section className="home-grid">
        <Link className="home-card home-card-red" to="/find">
          <h2>{t('nav.find')}</h2>
          <p>Search nearby donors by blood group and district.</p>
        </Link>
        <Link className="home-card home-card-teal" to="/register">
          <h2>{t('nav.register')}</h2>
          <p>Add your donor listing with OTP verification.</p>
        </Link>
        <Link className="home-card home-card-amber" to="/requests">
          <h2>{t('nav.requests')}</h2>
          <p>Post and browse urgent blood requests.</p>
        </Link>
        <Link className="home-card home-card-muted" to="/organizations">
          <h2>{t('nav.orgs')}</h2>
          <p>Trusted blood donation organizations in Bangladesh.</p>
        </Link>
      </section>
    </div>
  );
}
