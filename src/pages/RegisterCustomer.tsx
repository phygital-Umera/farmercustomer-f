import {useAuthContext} from '@/context/AuthContext';
import {useCustomerLogin, useCustomerRegister} from '@/lib/react-query/Auth/auth';
import {registerCustomerSchema, signInSchema} from '@/lib/validation/signInSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link, useNavigate} from '@tanstack/react-router';
import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {FiEye, FiMail, FiLock, FiUser, FiArrowRight} from 'react-icons/fi';
import {LuEyeOff} from 'react-icons/lu';
import {Sprout} from 'lucide-react';
import {z} from 'zod';
import toast from 'react-hot-toast';
import {useTranslation} from 'react-i18next';


type RegisterCustomerFormValues = z.infer<typeof registerCustomerSchema>;

const RegisterCustomer: React.FC = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {mutateAsync: registerCustomer, isError, isPending} = useCustomerRegister();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    setError,
  } = useForm<RegisterCustomerFormValues>({
    resolver: zodResolver(registerCustomerSchema),
    defaultValues: {
      fullname: '',
      role: 'CUSTOMER',
      phoneNumber: '',
      password: '',
    },
  });

  const {login, isAuthenticated} = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Triggers the entrance animation once the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // If user is already authenticated, redirect to dashboard
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate({to: '/dashboard'});
  //   }
  // }, [isAuthenticated, navigate]);
  const onSubmit = async (values: RegisterCustomerFormValues) => {
    const toastId = toast.loading(t('auth.registering'));
    try {
      const response = await registerCustomer(values);

      const accessToken = response?.data?.accessToken || response?.accessToken;
      const refreshToken = response?.data?.refreshToken || response?.refreshToken;
      const userData = response?.data?.user || response?.user;

      if (accessToken) {
        login(accessToken, userData, refreshToken);
      }

      toast.success(t('auth.registerSuccess'), { id: toastId });
      navigate({ to: '/' });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(
        error?.response?.data?.message || t('auth.registerFailed'),
        { id: toastId }
      );
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased selection:bg-[#2e7d32]/20 px-4 py-8">
      {/* Decorative Fresh Mandi Background Blurs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#00450d]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#2e7d32]/5 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div
          className={`w-full transform transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {/* Brand Logo and Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2e7d32]/20 bg-[#e8f5e9] text-[#1b5e20] shadow-xs">
              <Sprout size={32} strokeWidth={2.4} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#00450d]">
              {t('header.brand')}
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-[#525e54]">
              {t('auth.tagline')}
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-3xl border border-[#e0e6e0] bg-white p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* User ID */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                  <FiUser className="text-[#1b5e20]" />
                  {t('auth.name')}
                </label>
                <div className="group/input relative">
                  <input
                    type="text"
                    placeholder={t('auth.userIdPlaceholder')}
                    {...register('fullname')}
                    className={`w-full rounded-xl border bg-[#fcf9f8] px-4 py-3 text-sm text-[#1b1c1c] placeholder:text-[#717a6d] outline-none transition-all duration-200 ${
                      errors.fullname
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-[#cfd8d0] focus:border-[#00450d] focus:ring-4 focus:ring-[#00450d]/10'
                    } pr-12`}
                  />
                  <FiMail
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200 ${
                      errors.fullname ? 'text-red-500' : 'text-[#717a6d]'
                    }`}
                  />
                </div>
                {errors.fullname && (
                  <p className="animate-shake flex items-center gap-1 text-xs font-medium text-red-600">
                    <span>•</span> {t(errors.fullname.message || '')}
                  </p>
                )}
              </div>

                 <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                  <FiUser className="text-[#1b5e20]" />
                  {t('auth.phone')}
                </label>
                <div className="group/input relative">
                  <input
                    type="text"
                    placeholder={t('auth.userIdPlaceholder')}
                    {...register('phoneNumber')}
                    className={`w-full rounded-xl border bg-[#fcf9f8] px-4 py-3 text-sm text-[#1b1c1c] placeholder:text-[#717a6d] outline-none transition-all duration-200 ${
                      errors.phoneNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-[#cfd8d0] focus:border-[#00450d] focus:ring-4 focus:ring-[#00450d]/10'
                    } pr-12`}
                  />
                  <FiMail
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200 ${
                      errors.phoneNumber ? 'text-red-500' : 'text-[#717a6d]'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="animate-shake flex items-center gap-1 text-xs font-medium text-red-600">
                    <span>•</span> {t(errors.phoneNumber.message || '')}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b1c1c]">
                  <FiLock className="text-[#1b5e20]" />
                  {t('auth.password')}
                </label>
                <div className="group/input relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
                    {...register('password')}
                    className={`w-full rounded-xl border bg-[#fcf9f8] px-4 py-3 text-sm text-[#1b1c1c] placeholder:text-[#717a6d] outline-none transition-all duration-200 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-[#cfd8d0] focus:border-[#00450d] focus:ring-4 focus:ring-[#00450d]/10'
                    } pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717a6d] transition-colors duration-200 hover:text-[#00450d]"
                  >
                    {showPassword ? (
                      <LuEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="animate-shake flex items-center gap-1 text-xs font-medium text-red-600">
                    <span>•</span> {t(errors.password.message || '')}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full transform rounded-xl bg-[#00450d] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#1b5e20] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <span>
                    {isSubmitting ? t('auth.registering') : t('auth.register')}
                  </span>
                </button>
              </div>

              {/* Back to Home / Shopping Link */}
              <div className="pt-2 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b5e20] transition-colors hover:text-[#00450d]"
                >
                  <FiArrowRight className="rotate-180" />
                  <span>{t('cart.browse')}</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs font-medium text-[#525e54]">
            {t('auth.footer')}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterCustomer;
