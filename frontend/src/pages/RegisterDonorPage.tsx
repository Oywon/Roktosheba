import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { bloodGroupOptions, districtOptions } from '../lib/lists';
import { requestOtp, verifyOtp, createDonor } from '../lib/api';
import { BloodGroup, District } from '../types';

export default function RegisterDonorPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A_PLUS');
  const [district, setDistrict] = useState<District>('DHAKA');
  const [area, setArea] = useState('');
  const [lastDonation, setLastDonation] = useState('');
  const [available, setAvailable] = useState(true);
  const [otpCode, setOtpCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async () => {
    setError(null);
    try {
      await requestOtp(phone);
      setMessage('OTP sent to your phone. Enter it below to verify.');
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    }
  };

  const verifyCode = async () => {
    setError(null);
    try {
      const result = await verifyOtp(phone, otpCode, 'donor');
      setVerificationToken(result.verificationToken);
      setMessage('Phone verified. Submit the form to publish your listing.');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    }
  };

  const submit = async () => {
    setError(null);
    if (!verificationToken) {
      setError('Phone verification is required before submission.');
      return;
    }
    try {
      await createDonor({ name, phone, bloodGroup, district, area: area || undefined, lastDonation: lastDonation || undefined, available, verificationToken });
      setMessage('Your donor listing is live. Thank you for helping.');
      setName('');
      setPhone('');
      setArea('');
      setLastDonation('');
      setVerificationToken('');
      setOtpCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    }
  };

  return (
    <div>
      <PageHeader title="Register as donor" description="Share your blood type and district so people can call you in an emergency." />
      <section className="form-card">
        <div className="disclosure">Phone, name, and district are publicly searchable.</div>
        <div className="form-row">
          <label>Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
        </div>
        <div className="form-row">
          <label>Phone</label>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01XXXXXXXXX" />
        </div>
        <div className="action-row">
          <button onClick={sendOtp} className="secondary-button">Send OTP</button>
          <button onClick={verifyCode} className="secondary-button">Verify OTP</button>
        </div>
        <div className="form-row">
          <label>OTP code</label>
          <input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} placeholder="Enter OTP" />
        </div>
        <div className="form-row">
          <label>Blood group</label>
          <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value as BloodGroup)}>
            {bloodGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
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
          <label>Area</label>
          <input value={area} onChange={(event) => setArea(event.target.value)} placeholder="Optional area or neighborhood" />
        </div>
        <div className="form-row">
          <label>Last donation</label>
          <input type="date" value={lastDonation} onChange={(event) => setLastDonation(event.target.value)} />
        </div>
        <div className="form-row checkbox-row">
          <label>
            <input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} />
            I am available to donate
          </label>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="info-text">{message}</p> : null}
        <button className="primary-button" onClick={submit}>Publish donor listing</button>
      </section>
    </div>
  );
}
