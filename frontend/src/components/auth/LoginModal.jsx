import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Modal from "../ui/Modal";
import { loginUser } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(1, "Пароль обязателен"),
});

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { t } = useTranslation();
  const setAuth = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data.email, data.password);
      setAuth(res.access_token, { email: data.email });
      toast.success("Успешный вход!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Ошибка при входе");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("nav.signin")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMain dark:text-textMainDark mb-1">
            Email
          </label>
          <input
            {...register("email")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-textMain dark:text-textMainDark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="mail@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-textMain dark:text-textMainDark mb-1">
            Пароль
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-textMain dark:text-textMainDark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primaryHover transition-colors disabled:opacity-70"
        >
          {isSubmitting ? "Загрузка..." : t("nav.signin")}
        </button>

        <p className="text-center text-sm text-textMuted dark:text-textMutedDark mt-4">
          Нет аккаунта?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary font-bold hover:underline"
          >
            {t("nav.signup")}
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default LoginModal;
