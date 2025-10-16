export default function LevelBarSkeleton() {
  return (
    <article className="w-full flex-grow max-w-105 px-3 place-self-center xl:max-w-90 flex flex-col justify-center gap-2 md:border-l border-dark-gray h-23 md:pl-8 xl:pl-5">
      <div className="flex justify-between items-center">
        <div className="h-5 w-17 bg-white/10 animate-pulse rounded-full"></div>
        <div className="h-5 w-20 bg-white/10 animate-pulse rounded-full"></div>
      </div>
      <div className="relative w-full h-3 overflow-hidden rounded-2xl bg-white/10 animate-pulse"></div>
      <div className="flex items-center mt-1 gap-1">
        <div className="h-7 w-7 flex bg-white/10 animate-pulse rounded-full"></div>
        <div className="h-5 w-12 bg-white/10 animate-pulse rounded-full"></div>
      </div>
    </article>
  );
}
