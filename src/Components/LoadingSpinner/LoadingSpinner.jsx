import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  text = null 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-t-transparent rounded-full animate-spin ${colorClasses[color]}`}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 