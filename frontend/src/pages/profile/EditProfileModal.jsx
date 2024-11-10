import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });
  console.log(formData);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile(formData);
  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        link: authUser.link,
        bio: authUser.bio,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);
  return (
    <>
      <button
        className="btn btn-outline rounded-full text-or-website btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await updateProfile(formData);
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-or-website rounded p-2 input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-or-website rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-or-website rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-or-website rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-or-website rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-or-website rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="url"
              placeholder="Link"
              className="flex-1 input border border-or-website rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button className="btn btn-or-website rounded-full btn-sm text-white bg-or-website">
              {isUpdatingProfile ? (
                <ClipLoader color="#FFF" size="20" />
              ) : (
                "Update"
              )}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
