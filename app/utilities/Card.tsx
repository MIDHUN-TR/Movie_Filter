import Image from "next/image";

interface CardProps {
    title: string;
    description: string;
    year: string;
    image?: string;
}

export default function Card({ title, description, year, image }: CardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/50 p-4 transition-all duration-300 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1">
            <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-800">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <span className="text-4xl">🎬</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {year}
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
                    {title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {description}
                </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                    Details
                </button>
                <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-orange-400">
                    Watch Now
                </button>
            </div>
        </div>
    );
}
