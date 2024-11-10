import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatMemberSinceDate } from "../../utils/date/index.js";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import useFollow from "../../hooks/useFollow.jsx";
import { IoSettingsSharp } from "react-icons/io5";
import axios from "axios";
import { MdDelete } from "react-icons/md";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader.js";
import toast from "react-hot-toast";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile.jsx";
export default function ProfilePage() {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);

  const [feedType, setFeedType] = useState("posts");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { username } = useParams();
  const [myPustNumber, setMyPostNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`/api/posts/${authUser?.username}`)
      .then((response) => {
        setMyPostNumber(response.data.length);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }, []);
  const queryClient = useQueryClient();
  const { mutate: deleteAccount } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/users/delete", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success("Account deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        console.log("data:", data);
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });
  const dateOfJoin = formatMemberSinceDate(user?.createdAt);
  const isMyProfile = authUser?._id === user?._id;
  const amIfollowing = authUser?.following.includes(user?._id);
  console.log("User:", user);
  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    refetch();
  }, [username, refetch]);
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile({
    profileImg,
    coverImg,
  });
  const { follow, isPending } = useFollow();
  return (
    <div className="flex justify-center items-center w-[60%] ml-[16rem] ">
      <div className="!flex-[4_4_0]  ml-[3rem]  m-auto border-r border-[#FAB400] min-h-screen  overflow-x-hidden  flex flex-col     md:w-[50%] ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex justify-between w-full">
                  <div className="flex flex-col">
                    <p className="font-bold text-lg">{user?.fullName}</p>
                    <span className="text-sm text-slate-500">
                      {loading ? (
                        <ClipLoader color="#6b7280" size="10" />
                      ) : (
                        myPustNumber + " posts"
                      )}
                    </span>
                  </div>
                  <div className="dropdown">
                    <div tabIndex={0} role="button" className="m-1">
                      <IoSettingsSharp className="w-4 text-or-website " />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content right-5 md:right-auto z-[1] p-4 text-or-website shadow bg-base-100 rounded-box w-52"
                    >
                      <li className="focus:bg-stone-300">
                        <a
                          className="bg-white flex items-center gap-3 cursor-pointer"
                          onClick={deleteAccount}
                        >
                          <MdDelete className=" text-or-website" />
                          <p>Delete Account</p>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-gray-600 rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end    py-6 md:py-auto  md:px-4  mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn text-or-website btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && <ClipLoader color="#FFF" size="20" />}
                    {!isPending && amIfollowing && "Unfollow"}
                    {!isPending && !amIfollowing && "Follow"}
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className={`${
                      isUpdatingProfile
                        ? "border-[#000] bg-black"
                        : "border-[#FAB400] bg-white"
                    } btn  text-or-website rounded-full btn-sm  px-4 mr-2 ml-2 btn-outline`}
                    onClick={async () => {
                      await updateProfile({ profileImg, coverImg });
                      setCoverImg(null);
                      setProfileImg(null);
                    }}
                  >
                    {isUpdatingProfile ? (
                      <ClipLoader color="#FFF" size="20" />
                    ) : (
                      "Update"
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href={user?.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user?.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">{dateOfJoin}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-[#FAB400] mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-stone-100 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bg-[#FAB400] bottom-0 w-10 h-1 rounded-full " />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-stone-100 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-or-website" />
                  )}
                </div>
              </div>
            </>
          )}
          <Posts feedType={feedType} username={username} />
        </div>
      </div>
    </div>
  );
}
