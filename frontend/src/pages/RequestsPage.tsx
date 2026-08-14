import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchRequests, createRequest, requestOtp, verifyOtp } from '../lib/api';
import { bloodGroupOptions, districtOptions } from '../lib/lists';
import { EmergencyRequest, BloodGroup, District } from '../types';

export default function RequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A_PLUS');
  const [hospital, setHospital] = useState('');
  const [district, setDistrict] = useState<District>('DHAKA');
  const [contactPhone, setContactPhone] = useState('');
  const [unitsNeeded, setUnitsNeeded] = useState('');
  const [note, setNote] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const sendOtp = async () => {
    setError(null);
    try {
      await requestOtp(contactPhone);
      setMessage('OTP sent to your phone. Enter it below and verify.');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    }
  };

  const verifyPhone = async () => {
    setError(null);
    try {
      const result = await verifyOtp(contactPhone, otpCode, 'request');
      setVerificationToken(result.verificationToken);
      setMessage('Phone verified. Submit the request now.');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    }
  };

  const submitRequest = async () => {
    setError(null);
    if (!verificationToken) {
      setError('Please verify your phone first.');
      return;
    }
    try {
      await createRequest({
        bloodGroup,
        hospital,
        district,
        contactPhone,
        unitsNeeded: unitsNeeded || undefined,
        note: note || undefined,
        verificationToken,
      });
      setMessage('Request posted. Help is on the way.');
      setHospital('');
      setContactPhone('');
      setUnitsNeeded('');
      setNote('');
      setOtpCode('');
      setVerificationToken('');
      loadRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to post request');
    }
  };

  return (
    <div>
      <PageHeader title="Emergency requests" description="Share urgent blood needs and browse active requests." />
      <section className="form-card">
        <div className="form-row">
          <label>Blood group</label>
          <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value as BloodGroup)}>
            {bloodGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Hospital or location</label>
          <input value={hospital} onChange={(event) => setHospital(event.target.value)} placeholder="Ex: Apollo Hospital" />
        </div>
        <div className="form-row">
          <label>District</label>
          <select value={district} onChange={(event) => setDistrict(event.target.value as District)}>
            {districtOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Contact phone</label>
          <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="01XXXXXXXXX" />
        </div>
        <div className="action-row">
          <button className="secondary-button" onClick={sendOtp}>Send OTP</button>
          <button className="secondary-button" onClick={verifyPhone}>Verify OTP</button>
        </div>
        <div className="form-row">
          <label>OTP code</label>
          <input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} placeholder="Enter OTP" />
        </div>
        <div className="form-row">
          <label>Units needed</label>
          <input value={unitsNeeded} onChange={(event) => setUnitsNeeded(event.target.value)} placeholder="Optional units" />
        </div>
        <div className="form-row">
          <label>Note</label>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Additional details" />
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="info-text">{message}</p> : null}
        <button className="primary-button" onClick={submitRequest}>Post request</button>
      </section>
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
