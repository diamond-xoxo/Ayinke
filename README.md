# 🎂 Happy Birthday Ayinke — Tioluwanimi's Birthday Site

A beautiful, personal birthday tribute website built for **Tioluwanimi** with love.

🌐 **Live site:** [https://happybirthdayayinke.vercel.app](https://happybirthdayayinke.vercel.app)

---

## ✨ Features

- **Hero Section** — Full-screen animated birthday greeting
- **About Section** — Personal video + heartfelt message
- **Photo & Video Gallery** — 6 autoplay videos with click-to-expand lightbox (sound on click)
- **Secret Message** — Password-protected love letter with music & typewriter animation
- **Wishes Wall** — Real-time community wish board powered by Firebase Firestore
- **Admin Panel** — Password-protected dashboard to manage wishes (pin, hide, delete)
- **Background Music** — Ambient music player with custom controls
- **Confetti & Animations** — Full-page confetti on secret message reveal
- **Fully Responsive** — Works beautifully on mobile, tablet & desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | Vanilla CSS (custom design system) |
| Logic | Vanilla JavaScript |
| Database | Firebase Firestore (real-time) |
| Hosting | Vercel |
| Version Control | GitHub |

---

## 📁 Project Structure

```
HBD CODE/
├── index.html              # Main site
├── style.css               # All styles
├── script.js               # All site logic (lightbox, wishes, music, etc.)
├── admin.html              # Admin wish management panel
├── admin.js                # Admin panel logic (Firestore CRUD)
├── jade-lemac-constellations.mp3  # Secret message background music
├── video.mp4               # Hero/about background video
├── her.1.mp4 – her.6.mp4  # Gallery videos
└── nimi.*.jpeg             # Gallery/marquee photos
```

---

## 🔐 Admin Panel

Access the admin panel at `/admin.html`

- **Password:** `Ayinke`
- Features: view all wishes, pin to top, hide from public, delete, clear all

---

## 💌 Secret Message

The secret message section is unlocked with a password.

- **Password:** `Tioluwanimi`
- Reveals a personal letter with typewriter animation + background music

---

## 🔥 Firebase Setup

Wishes are stored in **Firebase Firestore** (real-time, cross-device).

- **Project:** `ayinke`
- **Collection:** `wishes`
- Each wish document: `{ name, location, message, timestamp, hidden, pinned, seeded }`

---

## 🚀 Deployment

The site is deployed on **Vercel** connected to this GitHub repository.  
Every `git push` to `main` automatically triggers a new deployment.

```bash
git add .
git commit -m "your message"
git push
```

---

Made with ❤️ for Tioluwanimi's special day.
