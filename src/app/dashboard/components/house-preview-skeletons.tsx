export const LoadingSkeletons = () => {
  return (
    <div className="flex flex-wrap -mx-2">
      {[...Array(32)].map((_, index) => (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4" key={index}>
          <div className="bg-gray-200 rounded-lg h-36 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};