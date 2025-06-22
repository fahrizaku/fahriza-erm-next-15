"use client";

export default function MessageDisplay({ message }) {
  if (!message.text) return null;

  return (
    <div
      className={`px-4 py-3 rounded-md text-sm ${
        message.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : message.type === "error"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
      }`}
    >
      {message.text}
    </div>
  );
}
