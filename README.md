# ✨ CurioNest: The Modern Habit Tracker

![CurioNest Banner](https://img.shields.io/badge/CurioNest-Modern_Habit_Tracker-fb923c?style=for-the-badge&logo=react)

CurioNest is a beautiful, professional-grade habit tracking web application designed to help users build and maintain positive daily routines. Re-architected from a legacy Java Monolith into a highly scalable, decoupled **React + Spring Boot** application, it is designed for performance, aesthetic appeal, and long-term maintainability.

---

## 🛠️ Technology Stack

**Frontend (Client-Side)**
* **React 18** + **Vite**: Lightning-fast frontend build tooling and UI rendering.
* **TailwindCSS v4**: Utility-first CSS framework used for a premium, custom "Glassmorphism" aesthetic.
* **Dynamic Animations**: Smooth CSS keyframe meshes and micro-interactions for an engaging UX.
* **Typography**: Beautiful blend of *Playfair Display* (Serif) and *Outfit* (Sans-serif) via Google Fonts.

**Backend (Server-Side)**
* **Spring Boot 3**: Enterprise-grade Java framework for the RESTful API.
* **Spring Data JPA**: Abstraction layer for robust and type-safe database interactions.
* **H2 / PostgreSQL**: In-memory H2 database for local development, seamlessly interchangeable with PostgreSQL for cloud production.
* **RESTful Architecture**: Clean, stateless API endpoints with proper JSON serialization/deserialization.

---

## 🚀 Key Features

* **The "Grace Day" (Streak Freeze) Mechanic 🔥**: A forgiving system that grants users a "Grace Day" so a missed day doesn't instantly wipe out a long streak. Psychologically prevents the "what the hell" effect and reduces user churn.
* **GitHub-Style "Consistency Heatmap" 🟩**: A visual 365-day grid tracking daily progress, turning routine completion into an engaging and motivating experience.
* **AI Recovery Coach 🧠**: A dynamic suggestion engine that offers actionable, psychological advice on how to bounce back from broken streaks based on the specific habit category.
* **Premium Two-Column UI**: A state-of-the-art desktop interface featuring a frozen left-panel calendar, animated mesh gradients, translucent panels, and flawless layout responsiveness.
* **Real-time Habit Tracking**: Complete or fail habits and watch your streaks and statistics update instantly.
* **Dynamic Resource Engine**: When a user misses a habit, CurioNest automatically offers curated psychological resources and articles to help them bounce back.
* **Data-driven Analytics**: Visual progress indicators, including daily completion percentages and total streak aggregations.

---

## 📂 Project Structure

The project has been split into two independent services:

1. **`/curionest-frontend`**: The React Single Page Application (SPA).
2. **`/curionest-api`**: The Spring Boot REST API.

---

## 💻 Running Locally

To run this application on your local machine, you need to start both the backend and frontend servers simultaneously.

### 1. Start the Backend API
The backend is configured to connect to a permanent cloud PostgreSQL database (via Supabase). 
```bash
cd curionest-api
./mvnw spring-boot:run
```
*(The API will start on `http://localhost:8080`)*

### 2. Start the Frontend
In a new terminal window, start the Vite development server:
```bash
cd curionest-frontend
npm install  # Only needed the first time
npm run dev
```
*(The UI will be accessible at `http://localhost:5173`)*

---

## 🏗️ 100% Free Deployment Architecture
CurioNest is architected to be cloud-native and can be deployed entirely for **free** using modern serverless platforms:

* **Database:** **Supabase** (Free Tier) provides a fully managed, production-ready PostgreSQL database.
* **Frontend:** **Vercel** or **Netlify** hosts the static React + Vite Single Page Application on a global edge network.
* **Backend API:** **Render.com** or **Koyeb** can host the compiled Spring Boot Java server on their free tier.

## 🎤 Elevator Pitch / Resume Highlight

*"I built CurioNest because I realized standard habit trackers punish users for being human. I engineered a Spring Boot and React application that focuses on psychological recovery rather than just streak counting. By implementing a dynamic resource engine and streak forgiveness, it acts as a coach rather than an accountant."*

---

*CurioNest - Built with passion by Sandesh.*