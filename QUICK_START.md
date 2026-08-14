# Quick Start Guide - RoktoSheba New Features

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

### Step 2: Run Development Server
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### Step 3: See the New Features!
- 🆘 Emergency hotline at the top of homepage
- 📍 Blood center finder with geolocation
- 🌐 Language selector in top-right
- 🌙 Dark mode toggle in top-right

---

## ✨ Feature Quick Tour

### Emergency Hotline (Joruri)
- **Location:** Top of homepage
- **Action:** Click phone number to call
- **Features:**
  - Spondon: 01746044205, 01748122764, 01619753240
  - BADHON Dhaka: 01552146988
  - Pulsing animation for urgency
  - Animated phone icon

### Language Selector
- **Icon:** 🌐 (top-right header)
- **Options:** English / বাংলা
- **Saves:** Automatically remembers your choice
- **Scope:** Changes all UI text

### Blood Center Finder
- **Location:** Below hotline on homepage
- **Action:** Click "Find Nearest Blood Center"
- **Uses:** GPS to find your location
- **Shows:** Top 5 nearest blood banks with distance
- **Actions:** 
  - Click phone number to call
  - Click "🗺️ Maps" for directions
- **Features:**
  - Distance calculation
  - Google Maps integration
  - Graceful fallback (Dhaka default)

### Dark Mode
- **Icon:** 🌙 (top-right header) 
- **Click:** Toggles dark ↔ light mode
- **Saves:** Remembers your preference
- **Colors:** 
  - Smart red/pink gradients
  - Optimized for night viewing
  - All components themed

---

## 📱 Responsive Design

All features work perfectly on:
- 💻 Desktop (full width)
- 📱 Tablet (optimized layout)
- 📱 Mobile (stacked layout)

---

## 🔧 Customization Quick Tips

### Add a Blood Center
**File:** `frontend/src/components/BloodCenterMap.tsx`

Find `BLOOD_CENTERS` array and add:
```javascript
{
  id: '6',
  name: 'Your Hospital',
  lat: 23.8103,
  lng: 90.4085,
  phone: '02-1234567',
  address: 'Your address, Dhaka',
}
```

### Add Translation
**File:** `frontend/src/context/LanguageContext.tsx`

Find translations object and add:
```javascript
en: {
  'your.key': 'English text'
},
bn: {
  'your.key': 'বাংলা পাঠ্য'
}
```

Use with: `const { t } = useLanguage(); {t('your.key')}`

### Change Colors
**File:** `frontend/src/styles.css`

Edit CSS variables:
```css
:root {
  --accent-from: #c81e3a;  /* Change primary color */
  --accent-to: #ff6b72;    /* Change secondary color */
}
```

---

## 🎨 Color Scheme

**Light Mode:**
- Primary: #c81e3a (Red)
- Secondary: #ff6b72 (Pink)
- Background: #ffffff (White)
- Text: #050505 (Black)

**Dark Mode:**
- Primary: #ff6b72 (Pink)
- Secondary: #c81e3a (Red)
- Background: #0f0f12 (Deep Navy)
- Text: #e8e8ec (Light Gray)

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Deploy
- Upload `dist/` folder to your hosting
- No backend changes required
- All features work statically

---

## 🐛 Troubleshooting

**Features not showing?**
- Clear browser cache (Ctrl+Shift+Del)
- Refresh page (Ctrl+F5)
- Check browser console for errors

**Language not changing?**
- Check localStorage (DevTools > Application > Storage)
- Ensure translations key is spelled correctly

**Dark mode not working?**
- Check browser support for CSS variables
- Clear localStorage and try again

**Maps not showing location?**
- Check browser permission for geolocation
- Try allowing location access
- Check console for errors

**Build failing?**
- Run `npm install --legacy-peer-deps` again
- Delete `node_modules/` and reinstall
- Check Node.js version (should be 14+)

---

## 📞 Emergency Numbers Reference

**For Quick Access:**
- Spondon: **01746044205** / 01748122764 / 01619753240
- BADHON: **01552146988**

Save these numbers in your phone!

---

## 🎯 Key Files Created/Modified

**New Files:**
- `frontend/src/context/LanguageContext.tsx`
- `frontend/src/context/ThemeContext.tsx`
- `frontend/src/components/EmergencyHotline.tsx` + `.css`
- `frontend/src/components/LanguageSelector.tsx` + `.css`
- `frontend/src/components/ThemeToggle.tsx` + `.css`
- `frontend/src/components/BloodCenterMap.tsx` + `.css`

**Modified Files:**
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`
- `frontend/src/styles.css`
- `frontend/src/pages/HomePage.tsx`
- `frontend/package.json`

---

## ✅ Verification Checklist

After installation, verify:
- [ ] Can see emergency hotline on homepage
- [ ] Can click phone numbers to call
- [ ] Language selector works (try switching)
- [ ] All text changes when switching language
- [ ] Dark mode toggle works (🌙)
- [ ] Dark mode has good contrast
- [ ] Can click "Find Nearest Blood Center"
- [ ] Geolocation prompt appears
- [ ] Blood centers list shows with distances
- [ ] Can click Google Maps link
- [ ] Website is responsive on mobile

---

## 📚 Additional Documentation

See `FEATURES_DOCUMENTATION.md` for:
- Detailed feature descriptions
- Customization guide
- Developer API reference
- Future enhancement ideas

---

**Ready to help save lives! 🩸💙**

Questions? Check the console (F12) for any error messages.
