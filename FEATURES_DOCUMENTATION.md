# Roktosheba - New Features Implementation

## Summary of Added Features

Your blood donation website has been enhanced with four major new features:

### 1. 🆘 Emergency Blood Hotline (Joruri)

**What it does:**
- Displays urgent hotline numbers for emergency blood needs
- Features two blood banks with contact information

**Details:**
- **Spondon Blood Bank**
  - 01746044205
  - 01748122764
  - 01619753240
  
- **BADHON Dhaka Central Zone**
  - 01552146988

**Features:**
- One-click calling (phone links)
- Beautiful card design with animations
- Pulsing header bar for urgency
- Appears on the homepage immediately
- Responsive design for all devices

**Location:** `frontend/src/components/EmergencyHotline.tsx` and `.css`

---

### 2. 🌍 Language Selection (Bangla & English)

**What it does:**
- Allows users to switch between English and Bengali (Bangla)
- Remembers language preference
- Translates all UI elements

**Features:**
- Language selector in top header
- Globe icon for easy access
- All navigation translated
- All labels translated
- Persistent storage (localStorage)
- Works with dark mode

**Currently Translated:**
- Navigation links
- Emergency hotline labels
- Maps feature labels
- Theme toggle labels

**Files:**
- `frontend/src/context/LanguageContext.tsx`
- `frontend/src/components/LanguageSelector.tsx`

**To add more translations:** Edit the `translations` object in `LanguageContext.tsx`:
```typescript
const translations: Record<Language, Record<string, string>> = {
  en: { 'your.key': 'English text' },
  bn: { 'your.key': 'বাংলা পাঠ্য' }
};
```

---

### 3. 📍 Google Maps Integration - Find Nearest Blood Center

**What it does:**
- Helps users find the nearest blood donation center in an emergency
- Uses GPS to detect user location
- Shows distance to each center
- Provides one-click navigation via Google Maps

**Features:**
- "Find Nearest Blood Center" button
- Uses browser geolocation
- Calculates distance using Haversine formula
- Shows top 5 nearest blood centers
- One-click call buttons
- One-click navigation to Google Maps
- Graceful fallback if location access denied
- Fallback to Dhaka center location

**Pre-loaded Blood Centers:**
1. Spondon Blood Bank
2. BADHON Central Zone
3. Bangabandhu Hospital Blood Bank
4. DMCH Blood Bank
5. Red Crescent Blood Bank

**How to add more centers:**
Edit the `BLOOD_CENTERS` array in `frontend/src/components/BloodCenterMap.tsx`:
```typescript
const BLOOD_CENTERS: BloodCenter[] = [
  {
    id: 'unique-id',
    name: 'Center Name',
    lat: 23.7913,
    lng: 90.4085,
    phone: '0XXX-XXXXX',
    address: 'Location details'
  }
];
```

**Files:** `frontend/src/components/BloodCenterMap.tsx` and `.css`

---

### 4. 🌙 Dark Mode with Smart Color Gradients

**What it does:**
- Provides a beautiful dark mode option for the entire website
- Uses optimized color scheme for night viewing
- Automatically detects system preference if first visit

**Color Scheme:**

**Light Mode:**
- Background: White (#ffffff)
- Text: Dark Gray (#050505)
- Accent Gradient: Red (#c81e3a) → Pink (#ff6b72)

**Dark Mode:**
- Background: Deep Navy (#0f0f12)
- Text: Light Gray (#e8e8ec)
- Accent Gradient: Pink (#ff6b72) → Red (#c81e3a) (reversed)
- Surface: Slightly lighter navy (#1a1a20)

**Features:**
- Toggle button in header (🌙/☀️)
- Persistent preference (localStorage)
- Smooth transitions
- Optimized readability in both modes
- All components styled for dark mode
- Beautiful gradients for dark mode
- Enhanced contrast for accessibility

**Files:**
- `frontend/src/context/ThemeContext.tsx`
- `frontend/src/components/ThemeToggle.tsx` and `.css`
- Updated `frontend/src/styles.css` with dark mode variables

---

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── EmergencyHotline.tsx (NEW)
│   │   ├── EmergencyHotline.css (NEW)
│   │   ├── BloodCenterMap.tsx (NEW)
│   │   ├── BloodCenterMap.css (NEW)
│   │   ├── LanguageSelector.tsx (NEW)
│   │   ├── LanguageSelector.css (NEW)
│   │   ├── ThemeToggle.tsx (NEW)
│   │   ├── ThemeToggle.css (NEW)
│   │   └── ... (existing components)
│   ├── context/
│   │   ├── LanguageContext.tsx (NEW)
│   │   └── ThemeContext.tsx (NEW)
│   ├── pages/
│   │   ├── HomePage.tsx (UPDATED)
│   │   └── ... (other pages)
│   ├── App.tsx (UPDATED)
│   ├── main.tsx (UPDATED)
│   └── styles.css (UPDATED)
└── package.json (UPDATED)
```

---

## Installation & Dependencies

The following new packages have been added:

```json
{
  "@react-google-maps/api": "^2.x",
  "leaflet": "^1.x",
  "react-leaflet": "^4.x"
}
```

Install with:
```bash
cd frontend
npm install --legacy-peer-deps
```

---

## How to Use

### For End Users:

1. **Language Selection:** Click the 🌐 icon in the top-right header
2. **Dark Mode:** Click the 🌙/☀️ icon in the top-right header
3. **Emergency Hotline:** On homepage, call directly from the card
4. **Find Blood Center:** Click "Find Nearest Blood Center" and allow location access

### For Developers:

**Using Language Context:**
```typescript
import { useLanguage } from './context/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  return <h1>{t('nav.home')}</h1>;
}
```

**Using Theme Context:**
```typescript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

---

## Customization Guide

### Add New Translations

Edit `frontend/src/context/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: {
    'your.new.key': 'English text',
  },
  bn: {
    'your.new.key': 'বাংলা পাঠ্য',
  },
};
```

Use in components:
```typescript
const { t } = useLanguage();
<span>{t('your.new.key')}</span>
```

### Add New Blood Centers

Edit the `BLOOD_CENTERS` array in `BloodCenterMap.tsx`:

```typescript
{
  id: '6',
  name: 'Your Hospital Blood Bank',
  lat: 23.8103,
  lng: 90.4085,
  phone: '02-XXXXXXX',
  address: 'Your Address, Dhaka',
}
```

### Modify Colors

Edit CSS variables in `frontend/src/styles.css`:

```css
:root {
  --accent-from: #c81e3a;  /* Change red */
  --accent-to: #ff6b72;    /* Change pink */
}

:root.dark-mode {
  --accent-from: #ff6b72;  /* Dark mode red */
  --accent-to: #c81e3a;    /* Dark mode pink */
}
```

---

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)
- ⚠️ Requires geolocation permission for maps feature

---

## Testing Checklist

- [x] Emergency hotline displays correctly
- [x] Phone numbers are clickable
- [x] Language selector works
- [x] All translations applied
- [x] Dark mode toggle works
- [x] Dark mode persists on reload
- [x] Light mode persists on reload
- [x] Blood center map loads
- [x] Geolocation detection works
- [x] Distance calculation accurate
- [x] Google Maps links work
- [x] Responsive design works
- [x] Build completes without errors
- [x] All CSS compiles correctly

---

## Performance Notes

- Language context uses React Context API (minimal overhead)
- Theme switching is instant (CSS variable updates)
- Geolocation is async (doesn't block UI)
- Distance calculations happen on-demand
- All components are optimized for production

---

## Future Enhancement Ideas

1. Add more blood centers to the database
2. Integrate with real blood bank APIs
3. Add blood type filtering in maps
4. Add blood donation appointment booking
5. Add blood urgency level system
6. Add social sharing for blood requests
7. Add push notifications for urgent requests
8. Add dark mode automatic scheduling
9. Add more language support (Arabic, Hindi, etc.)
10. Add blood bank inventory status

---

## Support

For any issues or questions about the implementation:
1. Check browser console for errors
2. Verify all files are in the correct locations
3. Ensure npm packages are installed: `npm install --legacy-peer-deps`
4. Rebuild the project: `npm run build`
5. Clear browser cache and localStorage if needed

---

**Built with React, TypeScript, and Vite** ⚡

Happy helping! 🩸
