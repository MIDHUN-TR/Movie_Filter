<p align="center">
  <h1 align="center">Movie Filter</h1>
  <p align="center">
    A premium personal watchlist manager for movies, series, anime, and TV shows.<br/>
    Built with Next.js 15, React 19, TailwindCSS 4, and MongoDB.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cloudinary-CDN-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

---

## ✨ Features

- **Multi-Content Tracking:** Keep track of your Movies, Series, Anime, and TV Shows all in one beautifully designed dashboard.
- **Advanced Season Management:** Track episode progress on a per-season level, complete with custom season naming support (e.g., "Final Season Part 1").
- **Live Search & Smart Filtering:** Instantly find what you're looking for with real-time title, genre, and cast search, plus dedicated tabs for content types and watching states (Pending / Watching / Watched).
- **Auto-Derived Watch States:** Let the app do the math — your series will automatically update their status from "Pending" to "Watching" to "Watched" based on your episode progress.
- **Smart Image Hosting:** Add posters seamlessly through Cloudinary. Paste an image URL from anywhere and it will be auto-fetched and hosted forever, or pick a file straight from your device.
- **Premium UI / UX:** Experience a modern, dark-themed interface built with TailwindCSS, featuring glassmorphism, gradient glows, smooth micro-animations, rich content cards, and seamless modal forms with dynamic fields.
- **Robust Full-Stack Architecture:** Powered by a fast Next.js App Router backend, serverless API routes for CRUD operations, and a highly-optimized Mongoose data schema.

---

## 🚀 Tech Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), React 19, [TailwindCSS 4](https://tailwindcss.com/) |
| **Backend** | Next.js Serverless API Routes |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) |
| **Storage/CDN** | [Cloudinary](https://cloudinary.com/) (Optimized poster delivery & remote URL fetching) |
| **State Management**| React State & Redux Toolkit |

---

## 🛠️ Getting Started

### Prerequisites

You will need a MongoDB cluster and a free Cloudinary account:
1. [Node.js](https://nodejs.org/) v18+
2. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (for your database)
3. [Cloudinary](https://cloudinary.com/) (for poster image hosting)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/movie_filter.git
cd movie_filter
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of your project and add the following keys:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?appName=appName

# Cloudinary Credentials (found on your Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

---

## 📂 Project Structure

```
movie_filter/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── movies/        # Complete CRUD endpoints for content
│   │   └── upload/        # Dual-mode Cloudinary upload endpoint
│   ├── dashboard/
│   │   ├── page.tsx       # Secure dashboard (Server Component)
│   │   └── DashboardClient.tsx  # Client wrapper holding search state
│   └── utilities/
│       ├── Header.tsx     # Animated search bar & quick-add
│       ├── ContentGrid.tsx # Filterable, text-searchable content grid
│       ├── Card.tsx       # Interactive content card with edit/delete modals
│       ├── AddButton.tsx  # Dynamic multi-season creation form
│       ├── ImageUpload.tsx # URL/Local file uploader with preview
│       └── navbar.tsx     # Responsive mobile/desktop navigation
├── models/
│   ├── movie.ts           # Advanced Mongoose schemas (IContent, ISeason)
│   └── user.ts            # User authentication model
├── types/
│   └── content.ts         # Centralized TypeScript interfaces & enums
└── lib/
    ├── mongodb.ts         # Cached database connection utility
    └── cloudinary.ts      # Cloudinary SDK & automated deletion helper
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build the optimized production bundle |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint strict checks |

---

## 🤝 Contributing
Contributions are always welcome! Feel free to open a pull request or file an issue if you encounter any bugs or have feature requests.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
