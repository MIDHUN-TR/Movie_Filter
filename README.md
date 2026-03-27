<p align="center">
  <h1 align="center">Movie Filter</h1>
  <p align="center">
    A personal watchlist manager for movies, series, anime, and TV shows.<br/>
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

## Features

| Feature | Description |
|---|---|
| **Multi-Content Tracking** | Track Movies, Series, Anime, and TV Shows in one place |
| **Season & Episode Management** | Per-season episode progress with custom season names |
| **Live Search** | Instantly filter your watchlist by title, genre, or cast |
| **Smart Filters** | Filter by content type and watching state (Pending / Watching / Watched) |
| **Cloudinary Image Hosting** | Upload posters via URL or local file — auto-hosted on Cloudinary |
| **Auto-Derived Watch State** | Series states update automatically based on episode progress |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TailwindCSS 4 |
| Backend | Next.js Serverless API Routes |
| Database | MongoDB via Mongoose |
| Storage | Cloudinary (optimized poster delivery) |
| State | Redux Toolkit |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- [Cloudinary](https://cloudinary.com/) account (free tier works)

### Installation

```bash
git clone https://github.com/yourusername/movie_filter.git
cd movie_filter
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?appName=appName

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
movie_filter/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication routes
│   │   ├── movies/        # CRUD API for content
│   │   └── upload/        # Cloudinary upload endpoint
│   ├── dashboard/
│   │   ├── page.tsx       # Dashboard (server component)
│   │   └── DashboardClient.tsx  # Client wrapper (search state)
│   └── utilities/
│       ├── Header.tsx     # Search bar
│       ├── ContentGrid.tsx # Filterable content grid
│       ├── Card.tsx       # Content card with edit/delete
│       ├── AddButton.tsx  # Add new content modal
│       ├── ImageUpload.tsx # Image upload component
│       └── navbar.tsx     # Navigation bar
├── models/
│   └── movie.ts           # Mongoose content schema
├── types/
│   └── content.ts         # TypeScript interfaces & enums
└── lib/
    ├── mongodb.ts         # Database connection
    └── cloudinary.ts      # Cloudinary SDK config
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## License

This project is open-source under the [MIT License](LICENSE).
