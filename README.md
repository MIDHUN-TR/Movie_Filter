<p align="center">
  <h1 align="center">🎬 Movie Filter</h1>
  <p align="center">
    A premium personal watchlist manager for movies, series, anime, and TV shows.<br/>
    Built with Next.js 15, React 19, TailwindCSS 4, MongoDB, and Cloudinary.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cloudinary-CDN-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## ✨ Features

### 📋 Content Management
- **Multi-Content Tracking** — Manage Movies, Series, Anime, and TV Shows all in one unified dashboard.
- **Full CRUD Operations** — Create, read, update, and delete entries through elegant modal forms.
- **Duplicate Prevention** — Automatic case-insensitive duplicate detection on both single-add and bulk import to ensure you never add the same content twice.

### 📺 Advanced Season & Episode Tracking
- **Per-Season Episode Tracking** — Track watched episodes vs total episodes on a per-season basis.
- **Custom Season Names** — Anime seasons support custom names (e.g., "Final Season Part 2", "Phantom Blood").
- **Auto-Derived Watch States** — Your watching status automatically updates from Pending → Watching → Watched based on episode progress.
- **Visual Progress Bars** — See completion percentage at a glance with animated progress indicators.

### 📄 CSV Bulk Import
- **Drag & Drop Import** — Upload a CSV file via drag & drop or file picker to bulk-add content.
- **Multi-Encoding Support** — Handles UTF-8, UTF-8 BOM, UTF-16, Latin-1 (ISO-8859-1), Windows-1252, Shift-JIS, EUC-JP, EUC-KR, GBK, Big5, and more. Auto-detects encoding or allows manual selection.
- **Smart Delimiter Detection** — Automatically detects commas, semicolons, or tabs as delimiters.
- **Flexible Column Mapping** — Accepts 50+ header name aliases (e.g., `Title`, `movieName`, `Name` all map to the title field).
- **Pre-Import Preview** — See all parsed rows in a preview table with ✅ (ready), ⚠️ (duplicate), or ❌ (error) status indicators before committing.
- **Anime Season Auto-Detection** — Parses season data in `SeasonName:EpisodeCount|SeasonName:EpisodeCount` format and auto-generates season names for anime.
- **Auto Cloudinary Upload** — All poster image URLs are automatically uploaded to Cloudinary during bulk import with progress tracking.

### 🔍 Search & Filtering
- **Real-Time Search** — Instantly filter content by title, genre, or cast name.
- **Smart Filter Tabs** — Quickly filter by content type (Movie, Series, Anime, TV Show) or watching state (Pending, Watching, Watched).
- **Result Counts** — See how many items match your current filter at a glance.

### 🖼️ Smart Image Hosting
- **Cloudinary Integration** — All poster images are automatically optimized and hosted on Cloudinary CDN for fast global delivery.
- **Dual Upload Modes** — Paste any image URL for remote fetching, or upload directly from your device.
- **Auto-Optimization** — Images are automatically resized (max 500px width), compressed, and converted to optimal formats.
- **Cleanup on Delete** — When you delete content, the associated Cloudinary image is automatically cleaned up.

### 🎨 Premium UI/UX
- **Dark-Themed Design** — Deep black (`#050505`) and purple (`#3A0CA3`) color palette for a modern, premium feel.
- **Glassmorphism & Gradients** — Backdrop blur effects, subtle gradient glows, and semi-transparent surfaces.
- **Micro-Animations** — Smooth hover effects, slide-up modals, rotation on close buttons, scale transforms, and progress animations.
- **Rich Content Cards** — Poster images with gradient overlays, type badges, status badges, genre tags, and inline metadata.
- **Responsive Design** — Adapts seamlessly from mobile to desktop with responsive grid layouts and collapsible navigation.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TailwindCSS 4](https://tailwindcss.com/) |
| **Backend** | Next.js Serverless API Routes |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/) |
| **Image CDN** | [Cloudinary](https://cloudinary.com/) (auto-optimization, remote URL fetching, CDN delivery) |
| **State** | React State, [Redux Toolkit](https://redux-toolkit.js.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |

---

## 🛠️ Getting Started

### Prerequisites

1. [Node.js](https://nodejs.org/) v18 or later
2. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works great)
3. [Cloudinary](https://cloudinary.com/) account (free tier — 25GB storage)

### 1. Clone & Install

```bash
git clone https://github.com/MIDHUN-TR/Movie_Filter.git
cd Movie_Filter
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?appName=MovieFilter

# Cloudinary Credentials (from your Cloudinary Dashboard → Settings → API Keys)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📂 Project Structure

```
movie_filter/
├── app/
│   ├── api/
│   │   ├── auth/               # Authentication endpoints
│   │   ├── movies/             # CRUD endpoints for content
│   │   │   ├── route.ts        # GET (list/search) + POST (create with duplicate check)
│   │   │   └── [id]/route.ts   # GET, PUT, DELETE single content
│   │   ├── import/             # CSV bulk import endpoints
│   │   │   └── route.ts        # POST (import) + PUT (duplicate check)
│   │   └── upload/             # Cloudinary image upload
│   │       └── route.ts        # POST (file or URL upload)
│   ├── dashboard/
│   │   ├── page.tsx            # Server Component — fetches & serializes data
│   │   └── DashboardClient.tsx # Client Component — search state management
│   ├── utilities/
│   │   ├── Header.tsx          # Search bar + Add Content + Import CSV buttons
│   │   ├── ContentGrid.tsx     # Filterable, searchable content grid
│   │   ├── Card.tsx            # Content card with edit/delete modals
│   │   ├── AddButton.tsx       # Add new content modal with dynamic fields
│   │   ├── CsvImport.tsx       # CSV import modal (drag & drop, preview, progress)
│   │   ├── ImageUpload.tsx     # Dual-mode image uploader with preview
│   │   └── navbar.tsx          # Responsive top navigation bar
│   ├── layout.tsx              # Root layout with Geist fonts
│   ├── page.tsx                # Login page
│   └── globals.css             # Global styles
├── lib/
│   ├── mongodb.ts              # Cached MongoDB connection utility
│   ├── cloudinary.ts           # Cloudinary SDK config + image deletion helper
│   └── csvParser.ts            # Multi-encoding CSV parser with column mapping
├── models/
│   ├── movie.ts                # Mongoose schema: Content (movie/series/anime/tv)
│   └── user.ts                 # Mongoose schema: User authentication
├── types/
│   └── content.ts              # TypeScript interfaces & enums (IContentBase, ISeason, etc.)
└── services/                   # Service layer (extensible)
```

---

## 📄 CSV Import Format

The CSV importer supports flexible column names and multiple formats. Here's the recommended structure:

### Column Reference

| Column | Required | Description | Example |
|---|---|---|---|
| `title` | ✅ | Content title | `Attack on Titan` |
| `type` | ✅ | Content type | `movie`, `series`, `anime`, `tv` |
| `posterImage` | ✅ | Poster image URL (auto-uploaded to Cloudinary) | `https://image.tmdb.org/t/p/w500/...` |
| `genres` | ✅ | Comma-separated genres | `Action, Fantasy, Drama` |
| `originalLanguage` | ✅ | Original language | `Japanese` |
| `countryOfOrigin` | ✅ | Country of origin | `Japan` |
| `cast` | Optional | Comma-separated cast | `Actor 1, Actor 2` |
| `watchingState` | Optional | Watch status (default: `pending`) | `pending`, `watching`, `watched` |
| `releaseDate` | Movies only | Release date | `2010-07-16` |
| `runtime` | Movies only | Runtime in minutes | `148` |
| `seasonsData` | Series/Anime/TV | Season & episode info (see below) | `25\|12\|22` |

### Season Data Formats

The `seasonsData` column supports multiple formats:

```
# Named seasons (ideal for anime)
Season 1:25|Season 2:12|Final Season:16

# Just episode counts (season names auto-generated for anime)
25|12|22|16

# Single season
24

# Mixed: some named, some not
Phantom Blood:26|Battle Tendency:24|48
```

### Example CSV

```csv
title,type,posterImage,genres,cast,originalLanguage,countryOfOrigin,watchingState,releaseDate,runtime,seasonsData
Inception,movie,https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg,"Action, Sci-Fi",Leonardo DiCaprio,English,United States,watched,2010-07-16,148,
Attack on Titan,anime,https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg,"Action, Fantasy","Yuki Kaji, Yui Ishikawa",Japanese,Japan,watching,,,"Season 1:25|Season 2:12|Season 3:22|Final Season:16"
Breaking Bad,series,https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg,"Crime, Drama","Bryan Cranston, Aaron Paul",English,United States,watched,,,7|13|13|13|16
```

### Supported Encodings

The parser handles all major encodings with auto-detection:

| Encoding | Common Use |
|---|---|
| UTF-8, UTF-8 BOM | Universal (default) |
| UTF-16 LE/BE | Windows exports |
| ISO-8859-1 (Latin-1) | Western European |
| Windows-1252 | Legacy Windows |
| Shift-JIS, EUC-JP | Japanese |
| EUC-KR | Korean |
| GBK, GB2312, Big5 | Chinese |

---

## 🔒 Duplicate Prevention

The app prevents duplicate content at two levels:

| Method | How It Works | Response |
|---|---|---|
| **Single Add** (Add Content button) | Case-insensitive title + type match before insert | Returns error: `"Inception" already exists in your movie watchlist` |
| **CSV Import** (Preview) | Pre-checks all titles against database | Marks duplicates with ⚠️ in preview table |
| **CSV Import** (Save) | Per-item duplicate check during batch processing | Skips duplicates, reports count in results summary |

> **Note:** Matching is scoped to content type — a movie named "Your Name" and an anime named "Your Name" are treated as separate entries.

---

## 🔌 API Reference

### Content CRUD

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies` | List all content (supports `?type=`, `?watchingState=`, `?search=` query params) |
| `POST` | `/api/movies` | Create new content (with duplicate check) |
| `GET` | `/api/movies/:id` | Get single content by ID |
| `PUT` | `/api/movies/:id` | Update content by ID |
| `DELETE` | `/api/movies/:id` | Delete content by ID (auto-cleans Cloudinary image) |

### Bulk Import

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/import` | Bulk import content items (with Cloudinary upload + duplicate skip) |
| `PUT` | `/api/import` | Check which titles are duplicates (for preview) |

### Image Upload

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload image to Cloudinary (accepts `file` or `url` in FormData) |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint strict checks |

---

## 🗄️ Data Model

### Content Schema

```typescript
{
  title: string;              // Required — content name
  type: 'movie' | 'series' | 'anime' | 'tv';
  posterImage: string;        // Cloudinary CDN URL
  genres: string[];           // e.g. ["Action", "Drama"]
  cast: string[];             // e.g. ["Actor Name"]
  originalLanguage: string;   // e.g. "Japanese"
  countryOfOrigin: string;    // e.g. "Japan"
  watchingState: 'pending' | 'watching' | 'watched';

  // Movie-specific
  releaseDate?: Date;
  runtime?: number;           // in minutes

  // Series/Anime/TV-specific
  numberOfSeasons?: number;
  seasons?: [{
    seasonNumber: number,
    name?: string,            // Custom name (anime only)
    numberOfEpisodes: number,
    watchedEpisodes: number
  }];
  completed?: boolean;

  createdAt: Date;            // Auto-generated
  updatedAt: Date;            // Auto-generated
}
```

### Database Indexes

| Index | Purpose |
|---|---|
| `title: "text"` | Full-text search on titles |
| `type: 1` | Fast filtering by content type |
| `watchingState: 1` | Fast filtering by watch status |
| `genres: 1` | Fast filtering by genre |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
