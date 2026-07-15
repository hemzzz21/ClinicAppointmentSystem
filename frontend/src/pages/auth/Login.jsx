import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/useAuth";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);

      login({
        token: res.data.token,
        user: res.data.user,
      });
      toast.success("Login Successful");

      if (res.data.user.role === "PATIENT") {
        navigate("/patient");
      } else if (res.data.user.role === "DOCTOR") {
        navigate("/doctor");
      } else if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8f5] px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

        {/* Left Side */}
        <section className="hidden bg-[#457D58] p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <Stethoscope />
            </div>

            <span className="text-xl font-bold">
              ClinicCare
            </span>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Your healthcare journey starts here.
            </h1>

            <p className="mt-5 max-w-md text-lg leading-8 text-white/80">
              Access appointments, doctors, schedules and notifications from one secure platform.
            </p>
          </div>

          <p className="text-sm text-white/70">
            Secure Clinic Appointment Management
          </p>

        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center p-8 sm:p-12">

          <div className="w-full max-w-md">

            <Link
              to="/"
              className="text-sm font-semibold text-[#457D58]"
            >
              ← Back to Home
            </Link>

            <h2 className="mt-8 text-3xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-600">
              Login to continue.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4">

                  <Mail
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    placeholder="Enter email"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                </div>

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}

              </div>

              {/* Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 px-4">

                  <LockKeyhole
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    {...register("password", {
                      required: "Password is required",
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        className="text-slate-400"
                      />
                    ) : (
                      <Eye
                        size={18}
                        className="text-slate-400"
                      />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}

              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#457D58] py-3.5 font-semibold text-white transition hover:bg-[#386849]"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="mt-6 text-center text-sm text-slate-600">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 font-semibold text-[#457D58]"
              >
                Register
              </Link>

            </p>

          </div>

        </section>

      </div>
    </main>
  );
}

export default Login;