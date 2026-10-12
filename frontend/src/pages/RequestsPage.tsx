import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchRequests, createRequest } from '../lib/api';
import { bloodGroupOptions, districtOptions, isBangladeshiPhone } from '../lib/lists';
import { EmergencyRequest, BloodGroup, District } from '../types';

export default function RequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A_PLUS');
  const [hospital, setHospital] = useState('');
  const [district, setDistrict] = useState<District>('DHAKA');
  const [contactPhone, setContactPhone] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadRequests = async () => {
    try {
      const result = await fetchRequests(false);
      setRequests(result);
    } catch (err: any) {
      setError(err.message || 'Unable to load requests');
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const submitRequest = async () => {
    setError(null);
    setMessage(null);
    if (hospital.trim().length < 2) {
      setError('Please enter a hospital or location.');
      return;
    }
    if (!isBangladeshiPhone(contactPhone)) {
      setError('Please enter a valid Bangladeshi mobile number.');
      return;
    }
    setSubmitting(true);
    try {
      await createRequest({
        bloodGroup,
        hospital: hospital.trim(),
        district,
        contactPhone: contactPhone.trim(),
        unitsNeeded: unitsNeeded.trim() || undefined,
        note: note.trim() || undefined,
      });
      setMessage('Emergency request posted. Help is on the way.');
      setHospital('');
      setContactPhone('');
      setUnitsNeeded('');
      setNote('');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to post request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Emergency requests" description="Share urgent blood needs and browse active requests." />
      <form className="form-card" onSubmit={(event) => { event.preventDefault(); void submitRequest(); }}>
        <div className="form-row">
          <label htmlFor="emergency-blood-group">Blood group</label>
          <select id="emergency-blood-group" value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value as BloodGroup)}>
            {bloodGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="emergency-hospital">Hospital or location</label>
          <input id="emergency-hospital" value={hospital} onChange={(event) => setHospital(event.target.value)} placeholder="Hospital or area" required minLength={2} />
        </div>
        <div className="form-row">
          <label htmlFor="emergency-district">District</label>
          <select id="emergency-district" value={district} onChange={(event) => setDistrict(event.target.value as District)}>
            {districtOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="emergency-phone">Contact phone</label>
          <input id="emergency-phone" type="tel" inputMode="tel" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="01XXXXXXXXX" required />
        </div>
        <div className="form-row">
          <label htmlFor="emergency-units">Units needed <span>(optional)</span></label>
          <input id="emergency-units" value={unitsNeeded} onChange={(event) => setUnitsNeeded(event.target.value)} placeholder="e.g. 2 units" />
        </div>
        <div className="form-row">
          <label htmlFor="emergency-note">Additional details <span>(optional)</span></label>
          <textarea id="emergency-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Blood needed for surgery, patient details, or timing" />
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="info-text">{message}</p> : null}
        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Posting request...' : 'Post emergency request'}
        </button>
      </form>
      <section className="result-list">
        <h2>Active requests</h2>
        {requests.length === 0 ? <p className="info-text">No active requests yet.</p> : null}
        {requests.map((request) => (
          <article className="result-card" key={request.id}>
            <div className="result-meta">
              <strong>{request.hospital}</strong>
              <span className="pill badge-red">{request.bloodGroup.replace('_PLUS', '+').replace('_MINUS', '-')}</span>
            </div>
            <div>{request.district.replace('_', ' ')}</div>
            <div>{request.unitsNeeded || 'Units not specified'}</div>
            {request.note ? <div>{request.note}</div> : null}
          </article>
        ))}
      </section>
    </div>
  );
}
