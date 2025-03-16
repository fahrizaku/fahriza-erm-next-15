import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";

export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ error }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-medium text-red-800">Error</h3>
          <p className="mt-1 text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
