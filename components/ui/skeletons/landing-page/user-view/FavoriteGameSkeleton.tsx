export default function FavoriteGameSkeleton() {
  return (
    <div className="h-full min-w-68.5 animate-pulse bg-white/5 rounded-xl p-5">
      <div className="flex justify-between items-center">
        <div className="w-16 h-13 bg-white/3 rounded-2xl"></div>
        <div className="flex flex-col gap-1 mr-3 items-end">
          <div className="w-17 h-7 bg-white/3 rounded-full"></div>
          <div className="w-14 h-4.5 bg-white/3 rounded-full"></div>
        </div>
      </div>
      <div className="mt-5">
        <div className="w-30 h-6 bg-white/3 rounded-full mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="w-14 h-4.5 bg-white/3 rounded-full"></div>
          <div className="w-20 h-4.5 bg-white/3 rounded-full mr-3"></div>
        </div>
      </div>
    </div>
  );
}
