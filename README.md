# 🎬 Movie Filter

A modern, highly-responsive web application built to help you track your watched movies, TV shows, anime, and series. Built with the latest Next.js 15 App Router, React, TailwindCSS, and MongoDB.

![Movie Filter Banner](https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **Multi-Content Tracking**: Keep track of Movies, Series, Anime, and TV Shows all in one place.
- **Detailed Season & Episode Management**: 
  - Track individual seasons and overall episode progress.
  - Support for custom season names (perfect for Anime like "Final Season Part 1").
- **Smart Image Management via Cloudinary**:
  - **Direct URL Uploading**: Paste an image link from anywhere on the web, and the app will automatically fetch and permanently host it on Cloudinary—no manual downloading required!
  - **Local File Upload**: Quickly pick and upload image files from your device.
- **Dynamic Watching States**: Mark items as `Pending`, `Watching`, or `Watched`. (Series automatically update their state based on your episode progress!)
- **Premium UI/UX**: Designed with beautiful glassmorphism, smooth micro-animations, rich gradients, and a sleek dark theme.

## 🚀 Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), React 19, [TailwindCSS 4](https://tailwindcss.com/)
- **Backend**: Next.js Serverless API Routes
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Storage/CDN**: [Cloudinary](https://cloudinary.com/) (for optimized poster image delivery)

## 🛠️ Getting Started

### Prerequisites

You will need a MongoDB cluster and a free Cloudinary account.
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (for your database)
2. [Cloudinary](https://cloudinary.com/) (for image hosting)

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `/app` - Next.js App Router pages and API routes (`/api/movies`, `/api/upload`).
- `/app/utilities` - Reusable UI components (`Card.tsx`, `AddButton.tsx`, `ImageUpload.tsx`).
- `/models` - Mongoose database schemas (`movie.ts`).
- `/types` - TypeScript interfaces and enums (`content.ts`).
- `/lib` - Database connection and Cloudinary SDK configuration.

## 🎨 Design Philosophy
Movie Filter prioritizes aesthetics and a premium feel. The UI avoids stark, generic colors in favor of curated slate/orange palettes, deep shadows, gradient glows, and smooth hover interactability to make your watchlist feel alive and engaging.

## 🤝 Contributing
Contributions are always welcome! Feel free to open a pull request or file an issue if you encounter any bugs or have feature requests.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
