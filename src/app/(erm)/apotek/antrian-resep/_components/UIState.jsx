// _components/UIStates.js
import React from "react";
import { AlertTriangle, FileSearch, Loader2 } from "lucide-react";

// Loading state component
export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      <p className="mt-4 text-gray-600 text-center">{message}</p>
    </div>
  );
}

// Empty state component
export function EmptyState({ message = "No data found", icon }) {
  const Icon = icon || FileSearch;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 rounded-full p-3">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <p className="mt-4 text-gray-600 text-center">{message}</p>
    </div>
  );
}

// Error state component
export function ErrorState({ error = "An error occurred", retryAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-100 rounded-full p-3">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <p className="mt-4 text-gray-700 text-center font-medium">
        Oops! Something went wrong
      </p>
      <p className="mt-2 text-gray-600 text-center">{error}</p>

      {retryAction && (
        <button
          onClick={retryAction}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
