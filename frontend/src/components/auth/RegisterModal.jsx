import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Modal from "../ui/Modal";
import { registerUser, loginUser } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

const registerSchema = z.object({
  full_name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(8, "Пароль минимум 8 символов"),
});

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { t } = useTranslation();
  const setAuth = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      // 1. Регистрируем
      await registerUser(data.full_name, data.email, data.password);
      // 2. Сразу логиним
      const res = await loginUser(data.email, data.password);
      setAuth(res.access_token, {
        email: data.email,
        full_name: data.full_name,
      });
      toast.success("Регистрация успешна!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Ошибка при регистрации");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("nav.signup")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMain dark:text-textMainDark mb-1">
            ФИО
          </label>
          <input
            {...register("full_name")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-textMain dark:text-textMainDark focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Иван Иванов"
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-textMain dark:text-textMainDark mb-1">
            Email
          </label>
          <input
            {...register("email")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-textMain dark:text-textMainDark focus:ring-2 focus:ring-primary outline-none transition-all"
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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-textMain dark:text-textMainDark focus:ring-2 focus:ring-primary outline-none transition-all"
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
          {isSubmitting ? "Создание..." : t("nav.signup")}
        </button>

        <p className="text-center text-sm text-textMuted dark:text-textMutedDark mt-4">
          Уже есть аккаунт?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary font-bold hover:underline"
          >
            {t("nav.signin")}
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default RegisterModal;
