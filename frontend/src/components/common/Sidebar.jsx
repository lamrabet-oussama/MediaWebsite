import icon from "../../assets/icon.png";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data; // Return data if successful
      } catch (error) {
        throw new Error(error.message || "An unexpected error occurred");
      }
    },
    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  return (
    <div className="md:flex-[2_2_0] fixed   p-1 ">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-[#FAB400] w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <img width="30" src={icon} alt="logo" />
        </Link>
        <ul className="flex flex-col  mt-4 text-[#FAB400] ">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-slate-50 transition-all border-b-2 border-[#FAB400]  w-full duration-300 py-2 pl-2 pr-4  cursor-pointer "
            >
              <MdHomeFilled className="w-8 h-8  " />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start items-center ">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-slate-50 transition-all border-b-2 border-[#FAB400]  w-full duration-300 py-2 pl-2 pr-4  cursor-pointer "
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-slate-50 transition-all   w-full duration-300 py-2 pl-2 pr-4  cursor-pointer "
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser?.username}`}
            className="mt-auto mb-10  gap-2  transition-all duration-300 border border-[#FAB400] py-2 px-4 rounded-full flex items-center"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-[#FAB400] font-bold text-sm  ">
                  {authUser?.fullName}
                </p>
                <p className="text-gray-500 text-sm">@{authUser?.username}</p>
              </div>
            </div>
            <BiLogOut
              onClick={(e) => {
                e.preventDefault();
                mutate();
              }}
              className="w-5 h-5 text-[#FAB400] text-lg cursor-pointer"
            />
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
