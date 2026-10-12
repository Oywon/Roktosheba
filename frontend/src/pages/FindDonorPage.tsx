import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { bloodGroupOptions, isBangladeshiPhone, savarAreaOptions } from '../lib/lists';
import { createDonorContactRequest, fetchDonors, reportDonor } from '../lib/api';
import { BloodGroup, Donor } from '../types';

export default function FindDonorPage() {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [area, setArea] = useState('');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requesterName, setRequesterName] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  const search = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const results = await fetchDonors({
        bloodGroup: bloodGroup || undefined,
        district: 'DHAKA',
        area: area || undefined,
      });
      setDonors(results);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  const submitContactRequest = async () => {
    if (!requestingId) return;
    if (!requesterName.trim() || !isBangladeshiPhone(requesterPhone)) {
      setError('Please enter your name and a valid Bangladeshi phone number.');
      return;
    }
    if (!requestMessage.trim() || requestMessage.trim().length < 10) {
      setError('Please provide a short reason or message for the donor.');
      return;
    }

    try {
      await createDonorContactRequest({
        donorId: requestingId,
        requesterName: requesterName.trim(),
        requesterPhone,
        message: requestMessage.trim(),
      });
      setMessage('Your contact request has been recorded.');
      setError(null);
      setRequestingId(null);
      setRequesterName('');
      setRequesterPhone('');
      setRequestMessage('');
    } catch (err: any) {
      setError(err.message || 'Unable to send contact request');
    }
  };

  const handleReport = async (donorId: string) => {
    try {
      await reportDonor(donorId);
      setMessage('Abuse report submitted for moderation.');
    } catch (err: any) {
      setError(err.message || 'Unable to submit report');
    }
  };

  return (
    <div>
      <PageHeader title="Find a donor" description="Search by blood group and Savar area. Number privacy is protected until a donor accepts the contact request." />

      <section className="form-card">
        <div className="form-row">
          <label>Blood Group</label>
          <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value as BloodGroup | '')}>
            <option value="">Select blood group</option>
            {bloodGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Area within Savar</label>
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            <option value="">Any Savar area</option>
            {savarAreaOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button className="primary-button" onClick={search} disabled={loading} type="button">Search donors</button>
      </section>

      {error ? <p className="error-text">{error}</p> : null}
      {message ? <p className="info-text">{message}</p> : null}

      <section className="result-list">
        {loading ? <p>Loading...</p> : null}
        {!loading && donors.length === 0 && (bloodGroup || area) ? <p className="info-text">No matches found.</p> : null}
        {donors.map((donor) => (
          <article className="result-card" key={donor.id}>
            <div className="result-meta">
              <strong>{donor.name}</strong>
              <span className="pill badge-red">{donor.bloodGroup.replace('_PLUS', '+').replace('_MINUS', '-')}</span>
            </div>
            <div className="result-body">
              <div><strong>Area:</strong> {donor.area || 'Savar area'}</div>
              <div><strong>Last donation:</strong> {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'Not recorded'}</div>
              <div><strong>Status:</strong> {donor.available ? 'Available now' : 'Not currently available'}</div>
            </div>
            <div className="action-row donor-actions">
              <button className="primary-button" type="button" onClick={() => setRequestingId(donor.id)}>Request Contact</button>
              <button className="secondary-button" type="button" onClick={() => handleReport(donor.id)}>Report abuse</button>
            </div>
          </article>
        ))}
      </section>

      {requestingId ? (
        <div className="modal-backdrop" onClick={() => setRequestingId(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Request donor contact</h3>
            <p>Please share your details so the donor can choose whether to respond.</p>
            <div className="form-row">
              <label>Your name</label>
              <input value={requesterName} onChange={(event) => setRequesterName(event.target.value)} placeholder="Your full name" />
            </div>
            <div className="form-row">
              <label>Your phone</label>
              <input value={requesterPhone} onChange={(event) => setRequesterPhone(event.target.value)} placeholder="01XXXXXXXXX" />
            </div>
            <div className="form-row">
              <label>Reason / message</label>
              <textarea value={requestMessage} onChange={(event) => setRequestMessage(event.target.value)} placeholder="Need blood for surgery at Savar Enam Medical" />
            </div>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={submitContactRequest}>Send request</button>
              <button className="secondary-button" type="button" onClick={() => setRequestingId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
