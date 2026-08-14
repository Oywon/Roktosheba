import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchOrganizations } from '../lib/api';
import { Organization } from '../types';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations().then(setOrganizations).catch((err) => setError(err.message || 'Unable to load organizations'));
  }, []);

  return (
    <div>
      <PageHeader title="Organizations" description="Trusted blood donation organizations for urgent backup support." />
      <section className="org-grid">
        {error ? <p className="error-text">{error}</p> : null}
        {organizations.map((org) => (
          <article className="org-card" key={org.id}>
            <h3>{org.name}</h3>
            <p className="org-founded">Founded {org.founded}</p>
            <p>{org.description}</p>
            <div className="action-row" style={{ marginTop: 12 }}>
              <a className="btn btn-ghost" href={org.websiteUrl} target="_blank" rel="noreferrer">Website</a>
              {org.contactPhone ? (
                <a className="btn btn-primary" href={`tel:${org.contactPhone}`}>Call: {org.contactPhone}</a>
              ) : (
                <span className="pill info-text">Phone not available</span>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
