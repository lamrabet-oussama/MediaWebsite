import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

export default function HomePage() {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <>
      <div className="flex-[4_4_0]  w-[60%] ml-[13rem] m-auto border-r border-[#FAB400] min-h-screen">
        {/* Header */}
        <div className="flex w-full border-b text-[#FAB400] border-[#FAB400] ">
          <div
            className={
              "flex justify-center flex-1 text-[#] p-3 hover:bg-slate-50 transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-[#FAB400] "></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 hover:bg-slate-50 transition duration-300 cursor-pointer relative"
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10  h-1 rounded-full bg-or-website"></div>
            )}
          </div>
        </div>

        {/*  CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts />
      </div>
    </>
  );
}
