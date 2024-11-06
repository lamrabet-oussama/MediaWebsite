import icon from "../../assets/icon.png";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

const Sidebar = () => {
  const data = {
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy1.png",
  };

  return (
    <div className="md:flex-[2_2_0] fixed  w-18 max-w-52 p-1 ">
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
              to={`/profile/${data?.username}`}
              className="flex gap-3 items-center hover:bg-slate-50 transition-all   w-full duration-300 py-2 pl-2 pr-4  cursor-pointer "
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-10  gap-2  transition-all duration-300 border border-[#FAB400] py-2 px-4 rounded-full flex items-center"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={data?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-[#FAB400] font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-gray-500 text-sm">@{data?.username}</p>
              </div>
            </div>
            <BiLogOut className="w-5 h-5 text-[#FAB400] text-lg cursor-pointer" />
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
