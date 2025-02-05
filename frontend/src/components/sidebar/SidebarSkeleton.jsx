
const SidebarSkeleton = () => {
  // Create 5 skeleton items
  const skeletonContacts = Array(5).fill(null);

  return (
    <aside
      className="transition-all h-screen duration-200 flex flex-col sm:h-[450px] md:h-[600px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 px-4"
    >
      {/* Skeleton Contacts */}
      <div className="py-2 flex flex-col overflow-auto">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="p-1 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="text-left flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;