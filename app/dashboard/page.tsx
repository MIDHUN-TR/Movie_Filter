import Navbar from "../utilities/navbar";
import Header from "../utilities/Header";
import ContentGrid from "../utilities/ContentGrid";
import connectDB from "@/lib/mongodb";
import Content from "@/models/movie";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let contentList: any[] = [];
  let dbError = false;

  try {
    await connectDB();
    const rawList = await Content.find().sort({ createdAt: -1 }).lean();
    // Serialize for client component (convert _id and dates to strings)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentList = rawList.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      releaseDate: item.releaseDate ? new Date(item.releaseDate).toISOString() : undefined,
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : undefined,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch content from database:", error);
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">

        <Header />

        {dbError ? (
          <div className="mt-12 rounded-xl bg-red-500/10 border border-red-500/30 p-6 text-center">
            <p className="text-red-400 text-lg font-semibold">⚠️ Unable to connect to the database</p>
            <p className="text-slate-400 text-sm mt-2">Please check your MongoDB connection string and ensure the cluster is running.</p>
          </div>
        ) : contentList.length === 0 ? (
          <div className="mt-12">
            <p className="text-slate-400">No movies or series found in your watchlist yet.</p>
          </div>
        ) : (
          <ContentGrid contentList={contentList} />
        )}
      </div>
    </div>
  );
}