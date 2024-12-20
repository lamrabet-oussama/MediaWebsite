import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./video.css";
import { MdVolumeUp } from "react-icons/md";
import { MdVolumeOff } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { motion } from "framer-motion";
import { formatPostDate } from "../../utils/date";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const [isMuted, setIsMuted] = useState(false);
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  const [showFullText, setShowFullText] = useState(false);
  const characterLimit = 600; // Limite de caractères avant d'afficher les points de suspension

  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };
  const isMyPost = authUser._id === post.user?._id;

  const formattedDate = formatPostDate(post.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/posts/delete/${post._id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (updatedLikes) => {
      //queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (newComments) => {
      const latestComment = newComments[newComments.length - 1];
      toast.success("Comment created successfully");
      setComment("");
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, comments: [...p.comments, latestComment] };
          }
          return p;
        });
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-start   p-4 border-b border-or-website">
        <div className="flex items-center gap-3 flex-1 ">
          <div className="avatar">
            <Link
              to={`/profile/${postOwner?.username}`}
              className="w-8 h-8 rounded-full block overflow-hidden"
            >
              <img src={postOwner?.profileImg || "/avatar-placeholder.png"} />
            </Link>
          </div>
          <div className="md:flex gap-3  ">
            <Link to={`/profile/${postOwner?.username}`} className="font-bold">
              {postOwner?.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner?.username}`}>
                @{postOwner?.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col  w-full ">
          <div className="flex gap-2 items-center ">
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {isDeleting ? (
                  <ClipLoader size="10" color="#FAB400" />
                ) : (
                  <FaTrash
                    className="cursor-pointer text-or-website hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>
              {showFullText || post?.text.length <= characterLimit
                ? post?.text
                : `${post?.text.slice(0, characterLimit)}... `}
              {post?.text.length > characterLimit && (
                <button
                  onClick={toggleTextDisplay}
                  className="text-blue-500 underline ml-2"
                >
                  {showFullText ? "Show less" : "Show more"}
                </button>
              )}
            </span>
            {post.img && (
              <div className="flex justify-center">
                <div className="w-[500px] text-center">
                  <a href={post.img} target="_blank" rel="noopener noreferrer">
                    <img
                      src={post.img}
                      className="object-contain rounded-lg border w-[500px] border-gray-700"
                      alt="Post image"
                    />
                  </a>
                </div>
              </div>
            )}

            {post.video && (
              <div className="flex justify-center">
                <div className="w-[800px]">
                  <div>
                    <Player
                      className="text-or-website"
                      src={post.video}
                      muted={isMuted}
                      autoPlay={false}
                    >
                      <ControlBar className="text-or-website " autoHide={false}>
                        <PlayToggle className="text-or-website" />
                        <VolumeMenuButton
                          className="text-or-website"
                          vertical
                        />
                        <CurrentTimeDisplay className="text-or-website" />
                        <TimeDivider className="text-or-website" />
                        <DurationDisplay className="text-or-website" />
                      </ControlBar>
                    </Player>
                    <button
                      onClick={toggleMute}
                      className="mt-2 p-2 bg-or-website text-white rounded"
                    >
                      {isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                id={`comments_modal${post._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment?.user?.profileImg ||
                                "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user?.fullName}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment?.user?.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none focus:border-or-website  border-gray-800"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn bg-or-website rounded-full btn-sm text-white px-4"
                    >
                      {isCommenting ? (
                        <ClipLoader color="#FFF" size="20" />
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiking && <ClipLoader color="#FAB400" size="20" />}
                {!isLiked && !isLiking && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                  </motion.div>
                )}
                {isLiked && !isLiking && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <FaHeart className="w-4 h-4 cursor-pointer text-red-600 " />
                  </motion.div>
                )}

                <span
                  className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                    isLiked ? "text-red-600" : ""
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
