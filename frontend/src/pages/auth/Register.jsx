import { Link } from "react-router-dom";

function Register() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f8f5] p-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Patient Registration</h1>
        <p className="mt-3 text-slate-600">
          The complete registration form will be added next.
        </p>

        <Link
          to="/login"
          className="mt-7 inline-block rounded-xl bg-[#457D58] px-6 py-3 font-semibold text-white"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}

export default Register;