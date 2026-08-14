import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { bloodGroupOptions, districtOptions } from '../lib/lists';
import { fetchDonors } from '../lib/api';
import { Donor, BloodGroup, District } from '../types';

export default function FindDonorPage() {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [district, setDistrict] = useState<District | ''>('');
  const [area, setArea] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setError(null);
    setLoading(true);
    try {
      const results = await fetchDonors({ bloodGroup: bloodGroup || undefined, district: district || undefined, area: area || undefined });
      setDonors(results);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Find a donor" description="Search only when you need help. Donor numbers are shown after search." />
      <section className="form-card">
        <div className="form-row">
          <label>Blood group</label>
          <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value as BloodGroup | '')}>
            <option value="">Select blood group</option>
            {bloodGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>District</label>
          <select value={district} onChange={(event) => setDistrict(event.target.value as District | '')}>
            <option value="">Select district</option>
            {districtOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Area</label>
          <input value={area} onChange={(event) => setArea(event.target.value)} placeholder="Optional area" />
        </div>
        <button className="primary-button" onClick={search} disabled={loading}>Search donors</button>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
      <section className="result-list">
        {loading ? <p>Loading...</p> : null}
        {!loading && donors.length === 0 ? <p className="info-text">No donors yet. Try refining your search.</p> : null}
        {donors.map((donor) => (
          <article className="result-card" key={donor.id}>
            <div className="result-meta">
              <strong>{donor.name}</strong>
              <span className="pill badge-red">{donor.bloodGroup.replace('_PLUS', '+').replace('_MINUS', '-')}</span>
            </div>
            <div>{donor.district.replace('_', ' ')}</div>
            {donor.area ? <div>{donor.area}</div> : null}
            <a className="call-button" href={donor.contactPhone}>Call donor</a>
          </article>
        ))}
      </section>
    </div>
  );
}
