import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { bloodGroupOptions, isBangladeshiPhone, savarAreaOptions } from '../lib/lists';
import { createDonor } from '../lib/api';
import { BloodGroup } from '../types';

const district: 'DHAKA' = 'DHAKA';

export default function RegisterDonorPage() {
  const [searchParams] = useSearchParams();
  const quickFlow = searchParams.get('source') === 'quick-donor';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A_PLUS');
  const [area, setArea] = useState(savarAreaOptions[0]);
  const [lastDonation, setLastDonation] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('MALE');
  const [available, setAvailable] = useState(true);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    setError(null);
    setMessage(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!isBangladeshiPhone(phone)) {
      setError('Please enter a valid Bangladeshi mobile number.');
      return;
    }
    if (!consent) {
      setError('Please confirm that you consent to being contacted through this app.');
      return;
    }
    const ageNumber = Number(age);
    if (age && (Number.isNaN(ageNumber) || ageNumber < 18 || ageNumber > 80)) {
      setError('Age must be between 18 and 80 years.');
      return;
    }

    try {
      await createDonor({
        name: name.trim(),
        phone,
        bloodGroup,
        district,
        area,
        lastDonation: lastDonation || undefined,
        age: age ? ageNumber : undefined,
        gender,
        available,
        consent,
      });

      setSubmitted(true);
      setMessage('Your donor listing is live. Thank you for helping the Savar community.');
      setName('');
      setPhone('');
      setArea(savarAreaOptions[0]);
      setLastDonation('');
      setAge('');
      setGender('MALE');
      setConsent(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    }
  };

  if (submitted) {
    return (
      <div>
        <PageHeader title="Thank you" description={quickFlow ? 'You are now part of the Savar donor network.' : 'Your donor registration is confirmed.'} />
        <section className="form-card success-card">
          <h3>Registration complete</h3>
          <p>You are now listed as a donor for Savar-area blood needs.</p>
          <p>Share this app with friends to help more people get support faster.</p>
          <div className="action-row">
            <Link className="primary-button" to="/">Return home</Link>
            <button className="secondary-button" onClick={() => window.location.href = '/register'}>Register another donor</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={quickFlow ? 'Become a donor' : 'Register as donor'} description="Share your blood type and Savar location so people can reach out when they need help." />
      <section className="form-card">
        <div className="disclosure">We only show your name, blood group, area, last donation, and availability in public search results. Your phone stays protected until a donor accepts a contact request.</div>

        <div className="form-row">
          <label>Full Name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
        </div>

        <div className="form-row">
          <label>Phone Number</label>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01XXXXXXXXX" />
        </div>

        <div className="form-row">
          <label>Blood Group</label>
          <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value as BloodGroup)}>
            {bloodGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Area / Location within Savar</label>
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {savarAreaOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Last Donation Date (optional)</label>
          <input type="date" value={lastDonation} onChange={(event) => setLastDonation(event.target.value)} />
        </div>

        <div className="two-col-grid">
          <div className="form-row">
            <label>Age</label>
            <input type="number" min={18} max={80} value={age} onChange={(event) => setAge(event.target.value)} placeholder="25" />
          </div>
          <div className="form-row">
            <label>Gender</label>
            <select value={gender} onChange={(event) => setGender(event.target.value)}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="form-row checkbox-row">
          <label>
            <input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} />
            Available now
          </label>
        </div>

        <div className="form-row checkbox-row">
          <label>
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            I consent to my info being used to connect me with people needing blood in this app.
          </label>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {message ? <p className="info-text">{message}</p> : null}
        <button className="primary-button" onClick={submit} type="button">Publish donor listing</button>
      </section>
    </div>
  );
}
