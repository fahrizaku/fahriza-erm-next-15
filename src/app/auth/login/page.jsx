"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();

  // Effect to handle redirection after successful login
  useEffect(() => {
    if (loginSuccess) {
      // Use hard redirect to ensure cookies are properly set
      window.location.href = "/pasien";
    }
  }, [loginSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username diperlukan";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password diperlukan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call the actual login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Mark login as successful, which will trigger the redirection effect
      setLoginSuccess(true);
    } catch (error) {
      setErrors({
        form:
          error.message ||
          "Login gagal. Periksa kembali username dan password Anda.",
      });
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white w-full border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm">
              <Stethoscope
                className="w-6 h-6 text-blue-600"
                strokeWidth={1.8}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
                <span className="text-blue-700">Medi</span>
                <span className="text-gray-600">Care</span>
              </h1>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Masuk ke Akun Anda
              </h2>
              <p className="text-gray-600 mt-2">
                Silahkan masuk untuk melanjutkan ke MediCare
              </p>
            </div>

            {errors.form && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {errors.form}
              </div>
            )}

            {loginSuccess && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                Login berhasil! Mengalihkan ke halaman pasien...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Username Field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.username ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="Masukkan username anda"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || loginSuccess}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : loginSuccess ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Mengalihkan...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MediCare. Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
