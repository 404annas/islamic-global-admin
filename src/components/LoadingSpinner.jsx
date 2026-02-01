import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-gray-600 text-lg">Loading...</p>
        <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the data</p>
      </div>
    </div>
  );
}
