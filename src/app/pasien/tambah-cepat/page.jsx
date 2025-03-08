// pages/patients/add.js

"use client";
import { useState } from "react";
import Head from "next/head";

export default function AddPatient() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    no_rm: "",
    name: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/tambah-cepat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          text: result.message,
          type: "success",
        });

        // Clear form after successful submission
        setFormData({
          no_rm: "",
          name: "",
          address: "",
        });
      } else {
        setMessage({
          text: result.message || "Gagal menambahkan pasien",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Terjadi kesalahan. Silakan coba lagi.",
        type: "error",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Tambah Pasien Cepat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Tambah Pasien Cepat
            </h1>
            <p className="text-sm text-slate-500">
              Lengkapi data pasien berikut
            </p>
          </div>

          {message.text && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.type === "success"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              } flex items-center text-sm font-medium`}
            >
              <span>{message.text}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl px-8 py-6 mb-4 border border-slate-100"
          >
            <div className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-2"
                  htmlFor="no_rm"
                >
                  Nomor RM
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2.5 px-4 text-slate-700 placeholder-slate-400 text-sm transition duration-150"
                  id="no_rm"
                  type="number"
                  placeholder="Masukkan Nomor RM"
                  name="no_rm"
                  value={formData.no_rm}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-2"
                  htmlFor="name"
                >
                  Nama Pasien
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2.5 px-4 text-slate-700 placeholder-slate-400 text-sm transition duration-150"
                  id="name"
                  type="text"
                  placeholder="Masukkan Nama Pasien"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-2"
                  htmlFor="address"
                >
                  Alamat
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2.5 px-4 text-slate-700 placeholder-slate-400 text-sm transition duration-150"
                  id="address"
                  placeholder="Masukkan Alamat Pasien"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="pt-3">
                <button
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    "Tambahkan Pasien"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
