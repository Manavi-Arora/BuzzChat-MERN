import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, Mail, User,Info,MousePointerClick} from "lucide-react";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-auto w-screen mt-5 ">
      <div className="max-w-2xl mx-auto ">
        <div className="bg-base-300 mt-10 rounded-xl p-4 space-y-5 backdrop-filter backdrop-blur-md bg-opacity-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black">PROFILE</h1>
            <p className="mt-2 text-black">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "avatar.jpg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-2 border-black "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <span className="text-sm text-black">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your profile"} 
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-md text-black flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-md text-black flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg">{authUser?.email}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-md text-black flex items-center gap-2">
            <Info className="w-4 h-4"/>
                Account Information
              </div>
            <div className="space-y-3 text-sm mt-6 bg-base-300 rounded-xl p-6">
              <div className="flex items-center justify-between py-2 border-b border-zinc-500">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;