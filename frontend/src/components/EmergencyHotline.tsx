import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './EmergencyHotline.css';

const EmergencyHotline: React.FC = () => {
  const { t, language } = useLanguage();

  const hotlines = [
    {
      name: t('emergency.spondon'),
      numbers: ['01746044205', '01748122764', '01619753240'],
      description: 'Spondon',
    },
    {
      name: t('emergency.badhon'),
      number: '01552146988',
      description: 'BADHON Dhaka Central Zone',
    },
  ];

  return (
    <div className="emergency-hotline">
      <div className="emergency-header">
        <div className="emergency-badge">🆘 {t('emergency.title')}</div>
        <h2>{t('emergency.title')}</h2>
        <p>{t('emergency.description')}</p>
      </div>

      <div className="hotlines-grid">
        {hotlines.map((hotline, idx) => (
          <div key={idx} className="hotline-card">
            <div className="hotline-icon">📞</div>
            <div className="hotline-content">
              <h3>{hotline.name}</h3>
              <p className="hotline-desc">{hotline.description}</p>
              <div className="hotline-numbers">
                {hotline.numbers ? (
                  hotline.numbers.map((num, i) => (
                    <a key={i} href={`tel:${num}`} className="phone-btn">
                      {num}
                    </a>
                  ))
                ) : (
                  <a href={`tel:${hotline.number}`} className="phone-btn">
                    {hotline.number}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyHotline;
