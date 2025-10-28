export default function MatchSkeleton() {
  return (
    <div className="min-h-25 w-full bg-white/10 animate-pulse gap-3 flex items-center rounded-xl">
      <div className="w-40 h-full bg-white/10 animate-pulse rounded-l-xl " />
      <div className="flex justify-between items-center w-full pr-4">
        <div className="flex flex-col gap-2">
          <div className="w-43 h-4 bg-white/10 animate-pulse rounded-full"></div>
          <div className="w-18 h-2 bg-white/10 animate-pulse rounded-full"></div>
          <div className="w-26 h-6 bg-white/10 animate-pulse rounded-full"></div>
        </div>
        <div className="flex flex-col gap-5 items-end">
          <div className="w-24 h-6 bg-white/10 animate-pulse rounded-xl " />
          <div className="w-36 h-3 bg-white/10 animate-pulse rounded-xl " />
        </div>
      </div>
    </div>
  );
}
