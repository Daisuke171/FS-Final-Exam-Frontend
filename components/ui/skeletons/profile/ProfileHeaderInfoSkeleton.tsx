export default function ProfileHeaderInfoSkeleton() {
  return (
    <article className="flex justify-between flex-shrink-0 md:pr-8 xl:pr-0 items-center gap-8">
      <div className="flex items-center gap-5">
        <div className="h-26 w-26 xl:h-30 xl:w-30 bg-white/10 animate-pulse rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="w-7.5 h-7.5 lg:hidden rounded-full bg-white/10 animate-pulse"></div>
          <div className="flex items-center gap-5">
            <div className="w-[115px] h-6 rounded-full bg-white/10 animate-pulse"></div>
          </div>
          <div className="w-[153px] h-5 rounded-full bg-white/10 animate-pulse"></div>
          <div className="[@media(min-width:458px)_and_(max-width:1024px)]:hidden flex items-center gap-2 lg:flex">
            <div className="w-[72px] h-8 xs:w-[80px] xs:h-9  rounded-2xl bg-white/10 animate-pulse"></div>
            <div className="w-[72px] h-8 xs:w-[80px] xs:h-9  rounded-2xl bg-white/10 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="hidden flex-col [@media(min-width:458px)_and_(max-width:1024px)]:flex items-center lg:hidden">
        <div className="w-[72px] h-8 xs:w-[80px] xs:h-9 rounded-2xl bg-white/10 animate-pulse"></div>
        <div className="w-[72px] h-8 xs:w-[80px] xs:h-9 rounded-2xl bg-white/10 animate-pulse"></div>
      </div>
    </article>
  );
}
