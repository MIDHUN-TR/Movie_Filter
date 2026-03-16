import Navbar from "../utilities/navbar";
import Header from "../utilities/Header";
import Card from "../utilities/Card";
import connectDB from "@/lib/mongodb";
import Content from "@/models/movie";
import { ContentType } from "@/types/content";

export default async function Dashboard() {
  let contentList: any[] = [];
  let dbError = false;

  try {
    await connectDB();
    contentList = await Content.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("Failed to fetch content from database:", error);
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="container mx-auto px-4 py-8">

        <Header />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 px-2 border-l-4 border-orange-500">
            My Watchlist
          </h2>
          {dbError ? (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
              <p className="text-red-400 text-lg font-semibold">⚠️ Unable to connect to the database</p>
              <p className="text-slate-400 text-sm mt-2">Please check your MongoDB connection string and ensure the cluster is running.</p>
            </div>
          ) : contentList.length === 0 ? (
            <p className="text-slate-400">No movies or series found in your watchlist yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {contentList.map((content: any) => (
                <Card
                  key={content._id.toString()}
                  id={content._id.toString()}
                  title={content.title}
                  posterImage={content.posterImage}
                  genres={content.genres}
                  cast={content.cast}
                  originalLanguage={content.originalLanguage}
                  countryOfOrigin={content.countryOfOrigin}
                  watchingState={content.watchingState}
                  type={content.type}
                  releaseDate={content.type === ContentType.MOVIE ? (content.releaseDate ? new Date(content.releaseDate).toISOString() : undefined) : undefined}
                  runtime={content.type === ContentType.MOVIE ? content.runtime : undefined}
                  numberOfSeasons={content.type !== ContentType.MOVIE ? content.numberOfSeasons : undefined}
                  seasons={content.type !== ContentType.MOVIE ? content.seasons || [] : undefined}
                  completed={content.type !== ContentType.MOVIE ? content.completed : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}