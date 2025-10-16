import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-[#99BC85]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#99BC85]"></div>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;