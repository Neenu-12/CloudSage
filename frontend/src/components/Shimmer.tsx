import React from "react";

export const Shimmer: React.FC<{ className?: string }> = ({
  className = "",
}) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

export const ShimmerCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Shimmer className="h-5 w-16" />
            <Shimmer className="h-5 w-12" />
          </div>
          <Shimmer className="mt-2 h-6 w-3/4" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <Shimmer className="h-4 w-4 mr-2" />
              <Shimmer className="h-4 flex-1 max-w-[200px]" />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
          <div className="flex-1">
            <Shimmer className="h-4 w-24 mb-2" />
            <Shimmer className="h-5 w-16" />
          </div>
          <Shimmer className="h-4 w-4" />
          <div className="flex-1">
            <Shimmer className="h-4 w-24 mb-2" />
            <Shimmer className="h-5 w-16" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-2 rounded-lg p-4 bg-white shadow-sm border border-gray-100"
          >
            <Shimmer className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Shimmer className="h-4 w-32 mb-2" />
              <Shimmer className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Shimmer className="h-10 w-full mb-2" />
      </div>
    </div>
  </div>
);

export const ShimmerDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-[#232F3E] text-white sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Shimmer className="h-8 w-48 mb-2" />
            <Shimmer className="h-4 w-64" />
          </div>
        </div>
      </div>
    </header>

    <main className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Shimmer className="h-7 w-48 mb-2" />
          <Shimmer className="h-5 w-96" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    </main>
  </div>
);
