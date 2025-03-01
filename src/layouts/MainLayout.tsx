import { useState } from "react";
import Logo from "../components/ui/Logo";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/layout/Navigation";
import { Menu, X, Search, Bell } from "lucide-react";

export default function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 lg:pl-72 transition-all duration-200">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors"
            >
              <Menu size={22} className="text-gray-700" />
            </button>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 h-11 pl-12 pr-4 bg-background rounded-xl text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="p-2.5 text-text-secondary hover:text-primary rounded-xl hover:bg-background relative">
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <div className="w-11 h-11 rounded-xl bg-background shadow-sm overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src="https://ui-avatars.com/api/?background=6C5CE7&color=fff&name=John+Doe"
                alt="User"
              />
            </div>
            <button
              onClick={async () => {
                try {
                  await logout();
                  navigate("/login");
                } catch (error) {
                  console.error("Logout error:", error);
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-background fixed top-0 left-0 bottom-0 z-30 border-r border-border">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="h-16 flex items-center px-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              StarKid
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Navigation variant="desktop" />
          </div>

          {/* Bottom Section */}
          <div className="p-4 mt-auto">
            <div className="p-4 bg-background rounded-xl">
              <div className="flex items-center space-x-3">
                <img
                  className="w-10 h-10 rounded-lg"
                  src="https://ui-avatars.com/api/?background=6C5CE7&color=fff&name=John+Doe"
                  alt="User"
                />
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    John Doe
                  </p>
                  <p className="text-xs text-text-tertiary">Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-text-primary/10 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out border-r border-border lg:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-border-light">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              StarKid
            </h1>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-background"
            >
              <X size={24} className="text-text-secondary" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6">
              <Navigation variant="desktop" />
            </div>
          </div>

          <div className="p-4 mx-4 mb-6 bg-background rounded-xl">
            <div className="flex items-center space-x-3">
              <img
                className="w-10 h-10 rounded-lg"
                src="https://ui-avatars.com/api/?background=6C5CE7&color=fff&name=John+Doe"
                alt="User"
              />
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  John Doe
                </p>
                <p className="text-xs text-text-tertiary">Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-gray-100 lg:hidden">
        <Navigation variant="mobile" />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 lg:pl-80 lg:pr-8 overflow-y-auto pt-20">
        <div className="max-w-7xl mx-auto pb-20 lg:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
