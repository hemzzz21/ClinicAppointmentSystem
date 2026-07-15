import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Input, TextArea, Select } from "../../components/ui/Form";

import { createDoctor } from "../../services/doctor.service";

const SPECIALIZATIONS = [
  "Cardiologist",
  "Dermatologist",
  "General Physician",
  "Pediatrician",
  "Neurologist",
  "Orthopedic",
  "Psychiatrist",
];

const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: "",
  qualification: "",
  experienceYears: "",
  consultationFee: "",
  bio: "",
  clinicLocation: "",
  slotDurationMinutes: 30,
};

function CreateDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.specialization) {
      toast.error("Name, email, password and specialization are required");
      return;
    }

    try {
      setSubmitting(true);
      await createDoctor({
        ...form,
        experienceYears: form.experienceYears
          ? Number(form.experienceYears)
          : undefined,
        consultationFee: form.consultationFee
          ? Number(form.consultationFee)
          : undefined,
        slotDurationMinutes: Number(form.slotDurationMinutes) || 30,
      });
      toast.success("Doctor created successfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create doctor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Admin"
        title="Create Doctor"
        subtitle="Add a new doctor and their profile to the platform."
      />

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Stethoscope size={20} className="text-[#457D58]" />
            Account details
          </h3>
          <div className="mt-5 space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Dr. Jane Smith"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="doctor@clinic.com"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Min 6 characters"
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="Contact number"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-900">Professional details</h3>
          <div className="mt-5 space-y-4">
            <Select
              label="Specialization"
              value={form.specialization}
              onChange={handleChange("specialization")}
            >
              <option value="">Select specialization</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Input
              label="Qualification"
              value={form.qualification}
              onChange={handleChange("qualification")}
              placeholder="MBBS, MD, etc."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Experience (years)"
                type="number"
                value={form.experienceYears}
                onChange={handleChange("experienceYears")}
                placeholder="10"
              />
              <Input
                label="Consultation fee (₹)"
                type="number"
                value={form.consultationFee}
                onChange={handleChange("consultationFee")}
                placeholder="500"
              />
            </div>
            <Input
              label="Clinic location"
              value={form.clinicLocation}
              onChange={handleChange("clinicLocation")}
              placeholder="City / address"
            />
            <Input
              label="Slot duration (minutes)"
              type="number"
              value={form.slotDurationMinutes}
              onChange={handleChange("slotDurationMinutes")}
            />
            <TextArea
              label="Bio"
              rows={3}
              value={form.bio}
              onChange={handleChange("bio")}
              placeholder="Short professional bio"
            />
          </div>
        </Card>

        <div className="lg:col-span-2 flex justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate("/admin/users")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            <Plus size={16} />
            Create Doctor
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default CreateDoctor;
