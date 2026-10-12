 <div align="center">

# 🩸 RoktoSheba

### Emergency Blood Donor Network for Bangladesh

**Helping people find blood support when every minute matters.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20RoktoSheba-red?style=for-the-badge)](https://roktosheba-three.vercel.app/)
[![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Application%20Code-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)

</div>

---

## 📌 About the Project

**RoktoSheba (রক্তসেবা)** is a web application designed to make blood-related emergency information easier to access in Bangladesh. It brings blood-service contact information and nearby blood-center discovery into one place, with a responsive interface designed for quick use on mobile devices.

The goal is simple: reduce the time and effort people spend searching for blood-service contacts during stressful situations.

🔗 **Live Application:** https://roktosheba-three.vercel.app/

> **Note:** RoktoSheba is an information and connection tool, not an emergency medical service. Always confirm donor availability, contact details, and medical requirements directly with the relevant organization or healthcare professional.

## ✨ Features

* 🚨 **Emergency Contact Access** — Quickly find and call listed blood-service contacts.
* 📍 **Nearby Blood Centers** — Discover listed blood centers using location-based features.
* 📏 **Distance-Based Results** — Find nearby centers based on geographical distance when location access is available.
* 🗺️ **Map Navigation** — Open directions to a selected center using supported map services.
* 🌐 **Bilingual Interface** — Access the interface in Bangla and English.
* 🌙 **Dark and Light Modes** — Choose a comfortable display theme.
* 📱 **Responsive Design** — Use the application on mobile, tablet, and desktop devices.

*Feature availability depends on the current implementation, browser permissions, and configured services.*

## 🧰 Technology Stack

| Technology                | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| React                     | User interface development                   |
| TypeScript                | Type-safe application code                   |
| Vite                      | Development server and build tool            |
| CSS                       | Responsive styling and themes                |
| React Context API         | Shared application state and preferences     |
| Browser Geolocation API   | Accessing the user's location when permitted |
| Map integrations          | Blood-center location and navigation         |
| Node.js and Express       | Backend API architecture                     |
| PostgreSQL and Prisma ORM | Database architecture                        |

## 🏗️ Project Structure

```text
RoktoSheba/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
└── README.md
```

*The directory structure may vary depending on the current repository version.*

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/) (version 18 or newer recommended)
* npm
* PostgreSQL, if running the backend locally

### 1. Clone the Repository

```bash
git clone https://github.com/Oywon/Roktosheba.git
cd Roktosheba
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `frontend/` directory if your application requires environment variables.

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

If your implementation uses Google Maps, configure the API key using the exact variable name expected by your code.

### 4. Start the Frontend

```bash
npm run dev
```

Open the local URL shown in your terminal. Vite commonly uses:

```text
http://localhost:5173
```

### 5. Configure the Backend (If Applicable)

Open a second terminal:

```bash
cd backend
npm install
```

Create a `backend/.env` file based on `backend/.env.example` and configure the required values.

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=replace_with_a_long_random_secret
OTP_CODE_TTL_SECONDS=300
PORT=4000
```

Run the backend commands supported by your project:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

**Important:** These backend commands assume the corresponding scripts exist in `backend/package.json`. Check the available scripts before running them.

## ⚙️ Environment Variables

| Variable               | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `VITE_API_BASE_URL`    | Backend API base URL                           |
| `DATABASE_URL`         | PostgreSQL connection string                   |
| `JWT_SECRET`           | Secret used for token signing and verification |
| `OTP_CODE_TTL_SECONDS` | OTP expiration time in seconds                 |
| `PORT`                 | Backend server port                            |
| `SMS_PROVIDER_API_KEY` | SMS provider credential, if configured         |

Only configure variables that are actually used by your code. Never commit real credentials, API keys, or production secrets to GitHub.

## 🌐 Live Deployment

The application is deployed on Vercel.

**Live URL:** [RoktoSheba Web App](https://roktosheba-three.vercel.app/)

For a separately hosted backend:

1. Deploy the API to a Node.js-compatible hosting provider.
2. Configure the PostgreSQL database, if required.
3. Add backend environment variables to the hosting dashboard.
4. Set `VITE_API_BASE_URL` to the deployed API URL.
5. Configure CORS to allow requests from the frontend domain.
6. Redeploy the frontend after changing environment variables.

**Security reminder:** Vite exposes variables prefixed with `VITE_` to client-side code. Never put private secrets in these variables.

## 🗺️ Future Roadmap

* [ ] Improve donor registration and donor search.
* [ ] Add phone-based OTP verification.
* [ ] Develop emergency blood-request and donor-matching workflows.
* [ ] Introduce notifications for urgent blood requests.
* [ ] Expand blood-center and organization coverage across Bangladesh.
* [ ] Improve data verification and reporting mechanisms.
* [ ] Add automated tests and deployment monitoring.
* [ ] Continue improving accessibility and mobile usability.

*Update this roadmap as features are implemented.*

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork this repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and test them locally.

4. Commit your changes:

   ```bash
   git commit -m "Describe your changes"
   ```

5. Push your branch and open a pull request.

For significant changes, consider opening an issue first to discuss your proposed approach.

## 🔐 Privacy and Safety

* Request location access only when needed.
* Protect donor information and obtain appropriate consent before publishing personal details.
* Verify blood-center contact information regularly.
* Keep API keys, database credentials, and authentication secrets private.
* Do not treat the application as a substitute for professional medical advice.

## 📄 License

No license is specified in this README. Unless a license is added to the repository, the source code is not automatically available for unrestricted reuse.

If you intend to make this project open source, consider adding an appropriate `LICENSE` file, such as an MIT License.

---

<div align="center">

**Built with care for a more connected blood-donation community in Bangladesh. 🩸**

[Live Application](https://roktosheba-three.vercel.app/) · [GitHub Repository](https://github.com/Oywon/Roktosheba) · [Report an Issue](https://github.com/Oywon/Roktosheba/issues)

</div>
