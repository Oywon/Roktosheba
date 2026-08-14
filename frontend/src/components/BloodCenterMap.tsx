import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './BloodCenterMap.css';

interface BloodCenter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone: string;
  address: string;
  distance?: number;
}

// Sample blood centers in Dhaka area
const BLOOD_CENTERS: BloodCenter[] = [
  {
    id: '1',
    name: 'Spondon Blood Bank',
    lat: 23.7913,
    lng: 90.4085,
    phone: '01746044205',
    address: 'Spondon, Dhaka',
  },
  {
    id: '2',
    name: 'BADHON Central Zone',
    lat: 23.8103,
    lng: 90.4081,
    phone: '01552146988',
    address: 'Dhaka Central Zone',
  },
  {
    id: '3',
    name: 'Bangabandhu Hospital Blood Bank',
    lat: 23.7679,
    lng: 90.3563,
    phone: '02-8615275',
    address: 'Shahbag, Dhaka',
  },
  {
    id: '4',
    name: 'DMCH Blood Bank',
    lat: 23.7733,
    lng: 90.3619,
    phone: '02-9661900',
    address: 'Dhaka Medical College, Dhaka',
  },
  {
    id: '5',
    name: 'Red Crescent Blood Bank',
    lat: 23.8064,
    lng: 90.3947,
    phone: '02-2232271',
    address: 'Kawran Bazar, Dhaka',
  },
];

const BloodCenterMap: React.FC = () => {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestCenters, setNearestCenters] = useState<BloodCenter[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const findNearestCenters = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          const centersWithDistance = BLOOD_CENTERS.map((center) => ({
            ...center,
            distance: calculateDistance(latitude, longitude, center.lat, center.lng),
          }))
            .sort((a, b) => (a.distance as any) - (b.distance as any))
            .slice(0, 5);

          setNearestCenters(centersWithDistance as any);
          setShowMap(true);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Dhaka center
          setUserLocation({ lat: 23.8103, lng: 90.4085 });
          setNearestCenters(BLOOD_CENTERS.slice(0, 5));
          setShowMap(true);
          setLoading(false);
        }
      );
    } else {
      setUserLocation({ lat: 23.8103, lng: 90.4085 });
      setNearestCenters(BLOOD_CENTERS.slice(0, 5));
      setShowMap(true);
      setLoading(false);
    }
  };

  const openInMaps = (center: BloodCenter) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(center.name)}/@${center.lat},${center.lng},15z`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="blood-center-map">
      <div className="map-header">
        <h3>📍 {t('maps.findNearest')}</h3>
        <p>Find emergency blood centers near you</p>
      </div>

      <button onClick={findNearestCenters} className="btn btn-primary find-btn" disabled={loading}>
        {loading ? 'Locating...' : '🔍 ' + t('maps.findNearest')}
      </button>

      {showMap && nearestCenters.length > 0 && (
        <div className="centers-list">
          <h4>Nearest Blood Centers:</h4>
          {nearestCenters.map((center, idx) => (
            <div key={center.id} className="center-card">
              <div className="center-rank">{idx + 1}</div>
              <div className="center-info">
                <h5>{center.name}</h5>
                <p className="center-address">{center.address}</p>
                {(center.distance as any) && <p className="center-distance">{((center.distance as any) * 1000).toFixed(0)}m away</p>}
                <a href={`tel:${center.phone}`} className="btn btn-small">
                  📞 {center.phone}
                </a>
              </div>
              <button onClick={() => openInMaps(center)} className="btn btn-small btn-map">
                🗺️ Maps
              </button>
            </div>
          ))}
        </div>
      )}

      {showMap && nearestCenters.length === 0 && (
        <div className="no-results">{t('maps.noResults')}</div>
      )}
    </div>
  );
};

export default BloodCenterMap;
