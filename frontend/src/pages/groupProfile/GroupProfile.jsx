import { useEffect, useState } from "react";
import { Camera, Mail, User, Info, Biohazard, Upload } from "lucide-react";
import { useGroupStore } from "../../store/useGroupStore";

const GroupProfile = (props) => {
  const { selectedGroup, isUpdatingGroupProfile, updateGroupProfilePic, isUpdatingGroupDesc, updateGroupDescription, fetchGroupWithMembers, groupData } = useGroupStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [groupDesc, setGroupDesc] = useState(selectedGroup?.description || "");

  const handleImageUpload = async (e) => {
    props.setProgress(20);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    props.setProgress(50);
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      props.setProgress(70);
      await updateGroupProfilePic({ profilePic: base64Image });
    };
    props.setProgress(100);
  };

  useEffect(() => {
    fetchGroupWithMembers(); 
  }, [selectedGroup]);

  const handleDescSubmit = async () => {
    if (groupDesc !== selectedGroup?.description) {
      props.setProgress(20);
      await updateGroupDescription({ description: groupDesc });
      props.setProgress(100);
    }
  };

  return (
    <div className="h-fit w-screen bg-[#2c2c2c] flex justify-center items-center">
      <div className="min-w-5/12 w-5/12">
        <div className="mt-16 rounded-xl p-4 bg-[#454545]">
          <div className="text-center">
            <h1 className="md:text-2xl font-bold text-light mb-1">GROUP PROFILE</h1>
          </div>

          {/* Group profile picture upload section */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={selectedImg || selectedGroup?.profilePic || "group_profile.png"}
                alt="Group Profile"
                className="size-32 rounded-full object-cover border-2 border-black "
              />
              <label
                htmlFor="group-avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingGroupProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="group-avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingGroupProfile}
                />
              </label>
            </div>
            <span className="text-sm text-light pb-3">
              {isUpdatingGroupProfile || isUpdatingGroupDesc ? "Uploading..." : "Click the camera icon or change group description to update your group profile"}
            </span>
          </div>

          {/* Group Information */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="text-md text-light flex items-center gap-2">
                <User className="w-4 h-4" />
                Group Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg">{selectedGroup?.name}</p>
            </div>
          </div>

          {/* Group Description */}
          <div className="space-y-2">
            <div className="text-md text-light flex items-center gap-2 mt-2">
              <Biohazard className="w-4 h-4" />
              Group Description
            </div>
            <div className="p-2 pl-1 bg-base-200 rounded-lg flex items-center justify-center">
              <textarea
                className="w-full h-8 resize-none outline-none pl-3 bg-transparent" // Fixed height to ensure single line
                value={groupDesc}
                onChange={(e) => { setGroupDesc(e.target.value) }}
                rows={1} // Ensures it's a single line (but the height is fixed)
                placeholder="Type group description"
              />
              <Upload
                className="cursor-pointer ml-2" // Add left margin to space out the icon
                onClick={handleDescSubmit}
              />
            </div>
          </div>

          {/* Account Information (Group Creation Date & Members) */}
          <div className="space-y-2">
            <div className="text-md text-light flex items-center gap-2 mt-2">
              <Info className="w-4 h-4" />
              Group Information
            </div>
            <div className="space-y-2 text-sm mt-6 bg-base-300 rounded-xl p-6">
              <div className="flex items-center justify-between py-2 border-b border-zinc-500">
                <span>Group Created On</span>
                <span>{selectedGroup?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Group Status</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                <div className="text-md text-light">Group Members:</div>
                <div className="space-y-1">
                  {groupData?.members?.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 px-4 py-2.5 bg-base-200 rounded-lg">
                      <img 
                        src={member.profilePic || "avatar.jpg"} 
                        alt={member.fullName} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <span>{member.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupProfile;
