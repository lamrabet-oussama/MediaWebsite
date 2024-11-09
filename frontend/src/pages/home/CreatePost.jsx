import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdVideoLibrary } from "react-icons/md";
import {
  Player,
  ControlBar,
  PlayToggle,
  VolumeMenuButton,
  CurrentTimeDisplay,
  TimeDivider,
  DurationDisplay,
} from "video-react";
import "video-react/dist/video-react.css";
const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);

  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async ({ text, img, video }) => {
      try {
        const response = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img, video }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      setVideo(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img, video });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setVideo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-[#FAB400]">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
              alt="Uploaded image"
            />
          </div>
        )}

        {video && (
          <div className="relative  mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setVideo(null);
                videoRef.current.value = null;
              }}
            />
            <Player
              className="text-or-website"
              src={video}
              autoPlay
              muted={isMuted}
            >
              <ControlBar className="text-or-website " autoHide={false}>
                <PlayToggle className="text-or-website" />
                <VolumeMenuButton className="text-or-website" vertical />
                <CurrentTimeDisplay className="text-or-website" />
                <TimeDivider className="text-or-website" />
                <DurationDisplay className="text-or-website" />
              </ControlBar>
            </Player>
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-[#FAB400]">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="text-[#FAB400] w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <MdVideoLibrary
              className="text-[#FAB400] w-6 h-6 cursor-pointer"
              onClick={() => videoRef.current.click()}
            />
            <BsEmojiSmileFill className="text-[#FAB400] w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
            accept="image/*"
          />
          <input
            type="file"
            hidden
            ref={videoRef}
            onChange={handleVideoChange}
            accept="video/*"
          />
          <button className="btn text-[#FAB400] hover:bg-slate-50 bg-white border border-[#FAB400] rounded-full btn-sm px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;
