import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/authStore";

const Profile = lazy(() => import("./pages/ProfilePage"));
const Chat = lazy(() => import("./pages/ChatbotPage"));
const Diagnostics = lazy(() => import("./pages/DiagnosticsPage"));
const Health = lazy(() => import("./pages/HealthAnalysisPage"));
const Symptoms = lazy(() => import("./pages/SymptomCheckerPage"));
const FirstAid = lazy(() => import("./pages/FirstAidPage"));
const Quiz = lazy(() => import("./pages/QuizPage"));
const Doctors = lazy(() => import("./pages/InfoPages").then((module) => ({ default: module.DoctorsPage })));
const About = lazy(() => import("./pages/InfoPages").then((module) => ({ default: module.AboutPage })));
const Contact = lazy(() => import("./pages/InfoPages").then((module) => ({ default: module.ContactPage })));

function RequireAuth({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return children;
  return <div className="mx-auto max-w-xl px-6 py-24 text-center">
    <h1 className="text-3xl font-bold mb-4">Войдите, чтобы продолжить</h1>
    <p>Нажмите «Войти» в верхнем меню или значок профиля на телефоне. Для презентации создайте аккаунт с вымышленными данными.</p>
  </div>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-bgLight dark:bg-bgDark text-textMain dark:text-textMainDark overflow-hidden">
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-grow pt-28">
          <div role="note" className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-950 dark:text-amber-100 bg-amber-50 dark:bg-amber-950/50 rounded-xl">
            Учебная демоверсия · ИИ: Gemini · Только вымышленные данные. Запросы и снимки отправляются в Google. Данные могут сбрасываться. Не для медицинских решений.
          </div>
          <Suspense fallback={<p role="status" className="p-12 text-center">Загрузка страницы…</p>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
              <Route path="/diagnostics" element={<RequireAuth><Diagnostics /></RequireAuth>} />
              <Route path="/health-analysis" element={<RequireAuth><Health /></RequireAuth>} />
              <Route path="/symptoms" element={<RequireAuth><Symptoms /></RequireAuth>} />
              <Route path="/quiz" element={<RequireAuth><Quiz /></RequireAuth>} />
              <Route path="/first-aid" element={<FirstAid />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<div className="p-24 text-center"><h1>Страница не найдена</h1><a href="/">На главную</a></div>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  </MotionConfig>;
}
export default App;
