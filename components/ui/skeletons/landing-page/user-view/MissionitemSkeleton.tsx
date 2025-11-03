export default function MissionItemSkeleton() {
  return (
    <div className="w-full h-45.5 bg-white/4 rounded-xl animate-pulse p-4 md:p-6">
      <div className="flex items-start gap-5 w-full">
        <div className="h-16 min-w-16 rounded-lg bg-white/4"></div>
        <div className="flex flex-col w-full">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-3 mt-1 w-full">
              <div className="w-40 h-5 bg-white/10 animate-pulse rounded-full"></div>
              <div className="w-32 h-3 bg-white/10 animate-pulse rounded-full"></div>
            </div>
            <div className="w-16 h-8 bg-white/10 animate-pulse rounded-full"></div>
          </div>
          <div className="flex flex-col gap-1 mt-6">
            <div className="flex items-center justify-between">
              <div className="w-18 h-3 bg-white/10 animate-pulse rounded-full" />
              <div className="w-8 h-4 bg-white/10 animate-pulse rounded-full" />
            </div>
            <div className="w-full h-3 bg-white/10 animate-pulse rounded-full" />
          </div>
          <div className="flex items-center mt-3 gap-2">
            <div className="w-24 h-5 bg-white/10 animate-pulse rounded-full" />
            <div className="w-28 h-5 bg-white/10 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
