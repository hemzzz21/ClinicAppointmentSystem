import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Stethoscope,
} from "lucide-react";
import toast from "react-hot-toast";

import { getDoctors } from "../../services/doctor.service";

function Doctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const response = await getDoctors({
        search,
        specialization,
        page: 1,
        limit: 20,
      });

      setDoctors(response.data?.doctors || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDoctors();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, specialization]);

  return (
    <main className="min-h-screen bg-[#f4f8f5] px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/patient")}
          className="flex items-center gap-2 font-semibold text-[#457D58]"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <div className="mt-8">
          <p className="text-sm font-semibold text-[#457D58]">
            Find specialists
          </p>

          <h1 className="mt-1 text-4xl font-bold text-slate-900">
            Choose the right doctor
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Search doctors by name or filter by specialization.
          </p>
        </div>

        <section className="mt-8 grid gap-4 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-[1fr_260px]">
          <div className="flex items-center rounded-2xl border border-slate-200 px-4 focus-within:border-[#457D58]">
            <Search size={20} className="text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search doctor name or email"
              className="w-full bg-transparent px-3 py-3.5 outline-none"
            />
          </div>

          <div className="flex items-center rounded-2xl border border-slate-200 px-4">
            <SlidersHorizontal size={20} className="text-slate-400" />

            <select
              value={specialization}
              onChange={(event) => setSpecialization(event.target.value)}
              className="w-full bg-transparent px-3 py-3.5 outline-none"
            >
              <option value="">All specializations</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="General Physician">General Physician</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div className="mt-14 text-center text-slate-500">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="mt-14 rounded-3xl bg-white p-10 text-center shadow-sm">
            <Stethoscope
              className="mx-auto text-slate-300"
              size={48}
            />

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No doctors found
            </h2>

            <p className="mt-2 text-slate-500">
              Try another search or specialization.
            </p>
          </div>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor) => (
              <article
                key={doctor.id}
                className="rounded-[28px] border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e4f0e7] text-[#457D58]">
                    <Stethoscope size={28} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {doctor.name}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {doctor.doctorProfile?.specialization ||
                        "Specialist"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-[#f5f9f6] p-3">
                    <p className="text-slate-500">Experience</p>
                    <p className="mt-1 font-bold text-slate-800">
                      {doctor.doctorProfile?.experienceYears || 0} years
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f5f9f6] p-3">
                    <p className="text-slate-500">Consultation fee</p>
                    <p className="mt-1 font-bold text-[#457D58]">
                      ₹{doctor.doctorProfile?.consultationFee || 0}
                    </p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                  {doctor.doctorProfile?.bio ||
                    "Experienced medical professional available for consultation."}
                </p>

                <button
                  onClick={() =>
                    navigate(`/patient/doctors/${doctor.id}`)
                  }
                  className="mt-6 w-full rounded-2xl bg-[#457D58] py-3.5 font-semibold text-white transition hover:bg-[#386849]"
                >
                  View Doctor & Slots
                </button>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default Doctors;