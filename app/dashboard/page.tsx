import Navbar from "../utilities/navbar";
import Header from "../utilities/Header";
import Card from "../utilities/Card";
import { WatchingState, ContentType } from "@/types/content";

const contentList = [
  // Movies
  {
    id: 1,
    title: "Inception",
    posterImage: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    genres: ["Action", "Sci-Fi", "Thriller"],
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    originalLanguage: "English",
    countryOfOrigin: "USA",
    watchingState: WatchingState.WATCHED,
    type: ContentType.MOVIE,
    releaseDate: "2010-07-16",
    runtime: 148,
  },
  {
    id: 2,
    title: "Interstellar",
    posterImage: "https://image.tmdb.org/t/p/w500/gEU2QniL6E8AHtMY4kRFW47322Z.jpg",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    originalLanguage: "English",
    countryOfOrigin: "USA",
    watchingState: WatchingState.WATCHED,
    type: ContentType.MOVIE,
    releaseDate: "2014-11-07",
    runtime: 169,
  },
  {
    id: 3,
    title: "The Dark Knight",
    posterImage: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    genres: ["Action", "Crime", "Drama"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    originalLanguage: "English",
    countryOfOrigin: "USA",
    watchingState: WatchingState.PENDING,
    type: ContentType.MOVIE,
    releaseDate: "2008-07-18",
    runtime: 152,
  },

  // Series
  {
    id: 4,
    title: "Breaking Bad",
    posterImage: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    genres: ["Crime", "Drama", "Thriller"],
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
    originalLanguage: "English",
    countryOfOrigin: "USA",
    watchingState: WatchingState.WATCHING,
    type: ContentType.SERIES,
    numberOfSeasons: 5,
    numberOfEpisodes: 62,
    watchedEpisodes: 45,
    completed: false,
  },
  {
    id: 5,
    title: "Stranger Things",
    posterImage: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    genres: ["Drama", "Fantasy", "Horror"],
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder"],
    originalLanguage: "English",
    countryOfOrigin: "USA",
    watchingState: WatchingState.WATCHED,
    type: ContentType.SERIES,
    numberOfSeasons: 4,
    numberOfEpisodes: 34,
    watchedEpisodes: 34,
    completed: true,
  },

  // Anime
  {
    id: 6,
    title: "Attack on Titan",
    posterImage: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    genres: ["Animation", "Action", "Drama"],
    cast: ["Yuki Kaji", "Yui Ishikawa", "Marina Inoue"],
    originalLanguage: "Japanese",
    countryOfOrigin: "Japan",
    watchingState: WatchingState.WATCHING,
    type: ContentType.ANIME,
    numberOfSeasons: 4,
    numberOfEpisodes: 87,
    watchedEpisodes: 60,
    completed: false,
  },
  {
    id: 7,
    title: "Death Note",
    posterImage: "https://image.tmdb.org/t/p/w500/g8hHbFmIqjQMPEpU7DsAFM76eJy.jpg",
    genres: ["Animation", "Crime", "Mystery"],
    cast: ["Mamoru Miyano", "Kappei Yamaguchi", "Shidou Nakamura"],
    originalLanguage: "Japanese",
    countryOfOrigin: "Japan",
    watchingState: WatchingState.WATCHED,
    type: ContentType.ANIME,
    numberOfSeasons: 1,
    numberOfEpisodes: 37,
    watchedEpisodes: 37,
    completed: true,
  },

  // TV Shows
  {
    id: 8,
    title: "Game of Thrones",
    posterImage: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    genres: ["Action", "Adventure", "Drama"],
    cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
    originalLanguage: "English",
    countryOfOrigin: "USA",
    watchingState: WatchingState.PENDING,
    type: ContentType.TV_SHOW,
    numberOfSeasons: 8,
    numberOfEpisodes: 73,
    watchedEpisodes: 70,
    completed: false,
  },
  {
    id: 9,
    title: "Walking Dead",
    posterImage: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    genres: ["Action", "Survival", "Drama"],
    cast: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
    originalLanguage: "English",
    countryOfOrigin: "USA",
    watchingState: WatchingState.PENDING,
    type: ContentType.TV_SHOW,
    numberOfSeasons: 8,
    numberOfEpisodes: 73,
    watchedEpisodes: 70,
    completed: false,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">

        <Header />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 px-2 border-l-4 border-orange-500">
            My Watchlist
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contentList.map((content) => (
              <Card
                key={content.id}
                title={content.title}
                posterImage={content.posterImage}
                genres={content.genres}
                cast={content.cast}
                originalLanguage={content.originalLanguage}
                countryOfOrigin={content.countryOfOrigin}
                watchingState={content.watchingState}
                type={content.type}
                releaseDate={content.type === ContentType.MOVIE ? content.releaseDate : undefined}
                runtime={content.type === ContentType.MOVIE ? content.runtime : undefined}
                numberOfSeasons={content.type !== ContentType.MOVIE ? content.numberOfSeasons : undefined}
                numberOfEpisodes={content.type !== ContentType.MOVIE ? content.numberOfEpisodes : undefined}
                watchedEpisodes={content.type !== ContentType.MOVIE ? content.watchedEpisodes : undefined}
                completed={content.type !== ContentType.MOVIE ? content.completed : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}