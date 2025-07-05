import React from 'react';

const SkeletonBox = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-300 rounded animate-pulse ${className}`} />
);

const SkeletonWeatherLoading = () => {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
      {/* Today's weather */}
      <section className="space-y-4">
        <div className="space-y-2">
          <SkeletonBox className="h-6 w-1/3" />

          <div className="bg-blue-300/50 gap-10 px-6 py-4 flex items-center rounded">
            {/* Temperature column */}
            <div className="flex flex-col px-4 gap-2">
              <SkeletonBox className="h-12 w-16" />
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-4 w-28" />
            </div>

            {/* Time & weather icon row */}
            <div className="flex gap-6 overflow-x-auto w-full pr-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                >
                  <SkeletonBox className="h-4 w-12" />
                  <SkeletonBox className="h-10 w-10 rounded-full" />
                  <SkeletonBox className="h-4 w-6" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather details section */}
        <div className="flex gap-4">
          <div className="w-fit bg-blue-300/50 flex justify-center flex-col px-4 py-3 items-center rounded">
            <SkeletonBox className="h-4 w-24 mb-2" />
            <SkeletonBox className="h-10 w-10 rounded-full" />
          </div>

          <div className="w-full bg-blue-300/50 px-6 py-3 gap-4 justify-between overflow-x-auto flex rounded">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-day forecast */}
      <section className="flex w-full flex-col gap-4">
        <SkeletonBox className="h-6 w-1/4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-blue-300/50 rounded p-4 flex justify-between items-center gap-4"
          >
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-4 w-20" />
              <SkeletonBox className="h-4 w-28" />
            </div>
            <SkeletonBox className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-4 w-16" />
              <SkeletonBox className="h-4 w-16" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default SkeletonWeatherLoading;