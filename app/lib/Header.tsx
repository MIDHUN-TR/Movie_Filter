
export default function Header() {
    return (
        <>
            <div className="w-full py-4 flex justify-center">
                <div className="relative w-full max-w-md">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="search"
                        name="search"
                        id="search"
                        className="h-[50px] w-full pl-10 pr-4 rounded-xl border border-white bg-transparent text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Search your content"
                    />
                </div>
            </div>
        </>
    )
}