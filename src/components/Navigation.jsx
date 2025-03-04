"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, Stethoscope, Loader2, RefreshCw } from "lucide-react";
import menuCategories from "@/data/menuData";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mountTimeout, setMountTimeout] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Tunggu sampai component di-mount sepenuhnya
  useEffect(() => {
    setMounted(true);

    // Set timeout untuk menampilkan tombol refresh jika mounting gagal
    const mountTimer = setTimeout(() => {
      if (!mounted) {
        setMountTimeout(true);
      }
    }, 3000);

    return () => {
      clearTimeout(mountTimer);
    };
  }, [mounted]);

  // Handle navigation state
  useEffect(() => {
    if (!mounted) return;

    // Create event listeners for route change events
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
    };

    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
    };

    // In Next.js App Router, we need to handle this differently
    // This is a simplified approach - for a complete solution consider using next/router events
    // or a custom solution with router.events if available

    // For demonstration, we'll simulate route change end after a timeout
    // when the pathname changes
    const handlePathnameChange = () => {
      setIsNavigating(false);
    };

    window.addEventListener("popstate", handleRouteChangeStart);

    // Clean up event listeners
    return () => {
      window.removeEventListener("popstate", handleRouteChangeStart);
    };
  }, [mounted, pathname]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const close = () => setIsOpen(false);

  const handleRefresh = () => {
    // Reload halaman
    window.location.reload();
  };

  // Custom navigation handler to show loading state
  const handleNavigation = (href) => {
    // Only set loading state and navigate if it's not the current page
    if (href !== pathname) {
      setIsNavigating(true);
      router.push(href);
    }
    close();
  };

  // Handle mobile vs desktop view
  useEffect(() => {
    if (!mounted) return;

    const checkScreenSize = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      // Jangan otomatis set isOpen pada perubahan ukuran layar
    };

    // Check initial screen size
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [mounted]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (!mounted) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) {
      close();
    }

    // When pathname changes, we know navigation is complete
    setIsNavigating(false);
  }, [pathname, mounted]);

  return (
    <>
      {/* Header */}
      <header className="bg-white fixed w-full top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 py-3">
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

          {/* Toggle Button untuk Sidebar (Mobile Only) */}
          {!mounted ? (
            <div className="lg:hidden p-2">
              {mountTimeout ? (
                <button
                  onClick={handleRefresh}
                  className="flex items-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              ) : (
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleToggle}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </header>

      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white/70 z-[60] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-blue-600 font-medium">
            Sedang memuat halaman...
          </p>
        </div>
      )}

      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          role="presentation"
          onClick={close}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar - removed mounted check */}
      <aside
        aria-label="Main navigation"
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 
          transform transition-transform duration-300
          bg-white shadow-lg overflow-y-auto
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="mt-8">
          {menuCategories.map((category, index) => (
            <div
              key={category.category}
              className={`px-4 ${index !== 0 ? "mt-6" : ""}`}
            >
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category.category}
              </h2>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href || "#"}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-lg transition-all duration-200
                    ${
                      pathname === item.href
                        ? "bg-blue-100 text-blue-600 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                    }`}
                    onClick={(e) => {
                      if (item.href) {
                        e.preventDefault();
                        handleNavigation(item.href);
                      } else {
                        close();
                      }
                    }}
                  >
                    <span
                      className={`mr-3 transition-colors duration-200 ${
                        pathname === item.href
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
