import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";

import { useQuery } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import useFollow from "../../hooks/useFollow";
const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });
  const { follow, isPending } = useFollow();
  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;
  return (
    <div className="hidden fixed xl:w-[21rem] right-0 top-0 xl:block my-4 mx-2">
      <div className="border border-[#FAB400] rounded-md text-[#FAB400] p-4  sticky top-2">
        <p className="font-bold">Who to follow ?</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers.suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 border-b-2 border-white p-2"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-gray-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user?._id);
                    }}
                  >
                    {isPending ? (
                      <div className="btn border-[#FAB400] bg-or-website text-[#FAB400] hover:text-white  rounded-full btn-sm">
                        <ClipLoader color="#FFF" size="20" />
                      </div>
                    ) : (
                      <span className="btn border-[#FAB400] bg-white text-[#FAB400] hover:text-white hover:bg-[#FAB400] rounded-full btn-sm">
                        Follow
                      </span>
                    )}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
