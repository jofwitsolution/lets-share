import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaThumbsUp, FaBookmark } from "react-icons/fa";

import { client, urlFor } from "../client";

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [likingPost, setLikingPost] = useState(false);

  const navigate = useNavigate();

  const { postedBy, image, _id, title } = pin;

  const user =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  let alreadySaved = pin?.save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  );

  let alreadyLiked = pin?.like?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  );

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];
  alreadyLiked = alreadyLiked?.length > 0 ? alreadyLiked : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const likePin = (id) => {
    if (alreadyLiked?.length === 0) {
      setLikingPost(true);

      client
        .patch(id)
        .setIfMissing({ like: [] })
        .insert("after", "like[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setLikingPost(false);
        });
    }
  };

  return (
    <div className="m-2 mb-8">
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mb-2 mt-5 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="text-xl font-semibold capitalize">{postedBy?.userName}</p>
      </Link>

      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        {image && (
          <img
            className="rounded-lg w-full"
            src={urlFor(image).url()}
            alt="user-post"
            style={{ maxHeight: "600px" }}
          />
        )}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved?.length !== 0 ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length} {savingPost ? "Saving" : "Save"}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {alreadyLiked?.length !== 0 ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.like?.length} Liked
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    likePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.like?.length} {likingPost ? "Liking" : "Like"}
                </button>
              )}
              {postedBy?._id === user?.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/*Display only on none hover and none pointer devices*/}
      <div className="touch-devices flex justify-between items-center gap-2 my-4">
        <div className="flex justify-between">
          {alreadyLiked?.length !== 0 ? (
            <button
              type="button"
              className="flex align-baseline text-dark text-base outline-none"
            >
              <FaThumbsUp className="text-secondary text-xl hover:opacity-70" />
              <span className="mx-2">{pin?.like?.length}</span>{" "}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                likePin(_id);
              }}
              type="button"
              className="flex align-baseline text-dark text-base outline-none"
            >
              {likingPost ? (
                "Liking..."
              ) : (
                <FaThumbsUp className="text-dark text-xl opacity-50 hover:opacity-100" />
              )}
              <span className="mx-2"> {pin?.like?.length}</span>
            </button>
          )}
          {alreadySaved?.length !== 0 ? (
            <button
              type="button"
              className="flex align-baseline text-dark text-base outline-none"
            >
              <FaBookmark className="text-secondary text-2xl hover:opacity-70" />
              <span className="mx-2">{pin?.save?.length}</span>{" "}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                savePin(_id);
              }}
              type="button"
              className="flex align-baseline text-dark text-base outline-none"
            >
              {savingPost ? (
                "Saving..."
              ) : (
                <FaBookmark className="text-dark text-2xl opacity-50 hover:opacity-100" />
              )}
              <span className="mx"> {pin?.save?.length}</span>
            </button>
          )}
        </div>
        <div className="flex justify-between">
          <a
            href={`${image?.asset?.url}?dl=`}
            download
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center justify-center text-secondary text-2xl mr-2 opacity-50 hover:opacity-100 outline-none"
          >
            <MdDownloadForOffline />
          </a>
          {postedBy?._id === user?.googleId && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deletePin(_id);
              }}
              className="flex items-center justify-center text-2xl text-secondary opacity-50 hover:opacity-100 outline-none"
            >
              <AiTwotoneDelete />
            </button>
          )}
        </div>
      </div>
      <h1 className="text-2 break-words my-2">{title}</h1>
    </div>
  );
};

export default Pin;
