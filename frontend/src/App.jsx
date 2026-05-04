import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatbotPage from "./pages/ChatbotPage";
import DiagnosticsPage from "./pages/DiagnosticsPage";
import HealthAnalysisPage from "./pages/HealthAnalysisPage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import FirstAidPage from "./pages/FirstAidPage";
import QuizPage from "./pages/QuizPage";
import { DoctorsPage, AboutPage, ContactPage } from "./pages/InfoPages";

// Глобальная обертка анимации для КАЖДОЙ страницы
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

// Блок роутинга с отслеживанием путей
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <ProfilePage />
            </PageWrapper>
          }
        />
        <Route
          path="/chat"
          element={
            <PageWrapper>
              <ChatbotPage />
            </PageWrapper>
          }
        />
        <Route
          path="/diagnostics"
          element={
            <PageWrapper>
              <DiagnosticsPage />
            </PageWrapper>
          }
        />
        <Route
          path="/health-analysis"
          element={
            <PageWrapper>
              <HealthAnalysisPage />
            </PageWrapper>
          }
        />
        <Route
          path="/symptoms"
          element={
            <PageWrapper>
              <SymptomCheckerPage />
            </PageWrapper>
          }
        />
        <Route
          path="/first-aid"
          element={
            <PageWrapper>
              <FirstAidPage />
            </PageWrapper>
          }
        />
        <Route
          path="/quiz"
          element={
            <PageWrapper>
              <QuizPage />
            </PageWrapper>
          }
        />

        <Route
          path="/doctors"
          element={
            <PageWrapper>
              <DoctorsPage />
            </PageWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <PageWrapper>
              <ContactPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-bgLight dark:bg-[#0f172a] transition-colors duration-500 selection:bg-primary/30 text-textMain dark:text-textMainDark overflow-hidden">
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "dark:bg-gray-800 dark:text-white rounded-2xl shadow-xl backdrop-blur-xl border border-gray-100 dark:border-gray-700",
            duration: 3000,
          }}
        />
        <Navbar />
        {/* Добавлен pt-24, так как Navbar теперь fixed и плавает поверх контента */}
        <main className="flex-grow pt-24">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
