const SkeletonItem = () => (
  <li className="p-2 border border-gray-200 rounded-md shadow-md mb-2 bg-gray-50">
    <div className="flex justify-between items-start animate-pulse">
      <div className="w-3/4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
        <div className="flex gap-2 mt-2">
          <div className="h-7 w-12 bg-gray-300 rounded-md"></div>
          <div className="h-7 w-16 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  </li>
);

export const TaskListSkeleton = () => {
  return (
    <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
        <div className="grid md:grid-cols-5 lg:grid-cols-3">
          <div className="md:col-span-3 md:col-start-2 lg:col-span-1 lg:col-start-2">
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Loading Tasks...</h2>
              <ul>
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
              </ul>
            </div>
          </div>
        </div>
    </main>
  );
};