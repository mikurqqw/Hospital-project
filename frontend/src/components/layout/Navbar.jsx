import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuthStore } from "../../store/authStore";
import { Sun, Moon, Globe, Activity, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useSettingsStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);
  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };
  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleNavClick = (item) => {
    if (item === "services") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(
          () =>
            document
              .getElementById("services")
              ?.scrollIntoView({ behavior: "smooth" }),
          150,
        );
      } else {
        document
          .getElementById("services")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item === "home" ? "/" : `/${item}`);
    }
  };

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 sm:px-6 ${scrolled ? "py-4" : "py-6"}`}
      >
        <div
          className={`mx-auto transition-all duration-500 ease-in-out ${
            scrolled
              ? "max-w-6xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-2xl shadow-primary/5 border border-white/40 dark:border-gray-700/50 rounded-[2rem] px-6"
              : "max-w-7xl bg-transparent px-2"
          }`}
        >
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="p-2 transition-transform shadow-lg bg-gradient-to-br from-primary to-blue-600 rounded-xl group-hover:scale-105 shadow-primary/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight transition-colors md:text-2xl text-textMain dark:text-textMainDark group-hover:text-primary">
                AI Health
              </span>
            </Link>

            <div className="hidden md:flex space-x-1 bg-gray-50/50 dark:bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-200/50 dark:border-gray-800/50">
              {["home", "services", "doctors", "about", "contact"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className="px-5 py-2 text-sm font-bold transition-all duration-300 rounded-full text-textMuted dark:text-textMutedDark hover:text-primary dark:hover:text-white hover:bg-white dark:hover:bg-gray-800"
                  >
                    {t(`nav.${item}`)}
                  </button>
                ),
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Globe className="w-5 h-5 text-textMain dark:text-textMainDark" />
                  <span className="text-xs font-bold uppercase text-textMain dark:text-textMainDark">
                    {i18n.language}
                  </span>
                </button>
                <div className="absolute right-0 invisible w-24 mt-2 overflow-hidden transition-all duration-200 border border-gray-100 shadow-xl opacity-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl group-hover:opacity-100 group-hover:visible dark:border-gray-800">
                  {["ru", "kz", "en"].map((lng) => (
                    <button
                      key={lng}
                      onClick={() => changeLanguage(lng)}
                      className="block w-full text-center py-2.5 text-sm font-bold hover:bg-primary hover:text-white transition-colors uppercase"
                    >
                      {lng}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-textMain dark:text-textMainDark"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <div className="items-center hidden gap-2 pl-4 ml-2 border-l border-gray-200 sm:flex dark:border-gray-800">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleNavClick("profile")}
                      className="flex items-center gap-2 p-1 pr-4 transition-colors border border-transparent rounded-full group bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full shadow-md bg-gradient-to-br from-primary to-blue-500">
                        {user?.full_name?.charAt(0)?.toUpperCase() || (
                          <User size={16} />
                        )}
                      </div>
                      <span className="text-sm font-bold text-textMain dark:text-textMainDark max-w-[100px] truncate">
                        {user?.full_name || "Профиль"}
                      </span>
                    </button>
                    <button
                      onClick={logout}
                      className="p-2 text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Выйти"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={openLogin}
                      className="px-5 py-2.5 rounded-full font-bold text-sm text-textMain dark:text-textMainDark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {t("nav.signin")}
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openRegister}
                      className="px-6 py-2.5 rounded-full font-bold text-sm bg-primary text-white shadow-lg shadow-primary/30"
                    >
                      {t("nav.signup")}
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};
export default Navbar;
