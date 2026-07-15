import { useRef, useState } from "react";
import { Camera, Loader as Loader2, Mail, Phone, Shield, Stethoscope, UserRound } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import { useAuth } from "../../context/useAuth";
import { uploadProfileImage } from "../../services/upload.service";
import { initials } from "../../utils/format";

function Profile({ role }) {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      const res = await uploadProfileImage(file);
      const updatedUser = res.data;
      login({
        token: localStorage.getItem("token"),
        user: updatedUser,
      });
      toast.success("Profile image updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const RoleIcon =
    role === "DOCTOR" ? Stethoscope : role === "ADMIN" ? Shield : UserRound;

  return (
    <DashboardLayout>
      <PageHeader eyebrow={`${role} account`} title="Profile" subtitle="Manage your account details and profile photo." />

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="text-center">
          <div className="relative mx-auto w-fit">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-[#e6f2e9]"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#e6f2e9] text-3xl font-bold text-[#457D58] ring-4 ring-white">
                {initials(user?.name) || <UserRound size={40} />}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#457D58] text-white shadow-lg transition hover:bg-[#386849] disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">{user?.name}</h2>
          <div className="mt-2 flex justify-center">
            <Badge status={user?.role} />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-900">Account details</h3>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#f5f9f6] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#457D58] shadow-sm">
                <UserRound size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Full name</p>
                <p className="font-semibold text-slate-800">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#f5f9f6] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#457D58] shadow-sm">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-semibold text-slate-800">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#f5f9f6] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#457D58] shadow-sm">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-semibold text-slate-800">{user?.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#f5f9f6] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#457D58] shadow-sm">
                <RoleIcon size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="font-semibold text-slate-800">{user?.role}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
