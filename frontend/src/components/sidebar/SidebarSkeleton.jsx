import SearchInput from "./SearchInput";

const SidebarSkeleton = () => {
  // Create 5 skeleton items
  const skeletonContacts = Array(5).fill(null);

  return (
    <aside
      className="transition-all duration-200 flex flex-col sm:h-[450px] md:h-[600px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-96 mt-10 px-4"
    >
      {/* Header */}
      <SearchInput />
      <div className='divider px-3 bg-gray-700 h-0.5'></div>
      {/* Skeleton Contacts */}
      <div className="py-2 flex flex-col overflow-auto">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;