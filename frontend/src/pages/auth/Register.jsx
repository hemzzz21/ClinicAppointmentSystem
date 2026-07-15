import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/useAuth";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { role: "PATIENT" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "PATIENT",
      });

      login({ token: res.data.token, user: res.data.user });
      toast.success("Account created successfully");
      navigate("/patient");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8f5] px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <section className="hidden bg-[#457D58] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Stethoscope />
            </div>
            <span className="text-xl font-bold">ClinicCare</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Create your patient account.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-white/80">
              Book appointments, track your visits, and stay informed with instant notifications.
            </p>
          </div>

          <p className="text-sm text-white/70">
            Secure Clinic Appointment Management
          </p>
        </section>

        <section className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <Link to="/" className="text-sm font-semibold text-[#457D58]">
              ← Back to Home
            </Link>

            <h2 className="mt-8 text-3xl font-bold text-slate-900">
              Patient Registration
            </h2>
            <p className="mt-2 text-slate-600">
              Create an account to start booking appointments.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
              <Input
                label="Full name"
                icon={UserRound}
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
              />

              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
                error={errors.email?.message}
              />

              <Input
                label="Phone"
                type="tel"
                icon={Phone}
                placeholder="Enter phone number"
                {...register("phone")}
                error={errors.phone?.message}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-[#457D58]">
                  <LockKeyhole size={18} className="text-slate-400" />
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-slate-400" />
                    ) : (
                      <Eye size={18} className="text-slate-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full"
                size="lg"
              >
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 font-semibold text-[#457D58]"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
