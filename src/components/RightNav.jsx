import React, { useState, useEffect } from "react";
import { client, urlFor } from "../client";
import { userCreatedPinsQuery } from "../utils/data";
import { Link, useNavigate } from "react-router-dom";
import { userLikedPinsQuery } from "./../utils/data";
import { GoogleLogout } from "react-google-login";

const RightNav = ({ user }) => {
  const navigate = useNavigate();

  const [pins, setPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

  const recentPins = pins?.slice(0, 4);
  const recentLikedPins = likedPins?.slice(0, 4);

  useEffect(() => {
    const createdPinsQuery = userCreatedPinsQuery(user?._id);

    client.fetch(createdPinsQuery).then((data) => {
      setPins(data);
    });

    const likedPinsQuery = userLikedPinsQuery(user?._id);

    client.fetch(likedPinsQuery).then((data) => {
      setLikedPins(data);
    });
  }, [user]);

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  return (
    <>
      <Link
        to={`/user-profile/${user?._id}`}
        className="flex gap-2 mb-2 mt-5 items-center"
      >
        <p className="text-primary text-xl font-semibold capitalize">
          {user?.userName}
        </p>
      </Link>
      <Link
        to={`/create-pin`}
        className="rounded-full w-max px-5 py-2 border border-red-800 items-center hover:text-white hover:bg-red-500"
      >
        Create Pin
      </Link>
      {user && (
        <GoogleLogout
          clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
          render={(renderProps) => (
            <button
              type="button"
              className=" rounded-full mt-2 w-max px-5 py-2 border border-red-800 items-center hover:text-white hover:bg-red-500"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Sign out
            </button>
          )}
          onLogoutSuccess={logout}
          cookiePolicy="single_host_origin"
        />
      )}
      {/* <Link
        to={`/create-pin`}
        className="rounded-full mt-2 w-max px-5 py-2 border border-red-800 items-center hover:text-white hover:bg-red-500"
      >
       
      </Link> */}

      <h3 className="mt-8 font-bold mb-2 text-base 2xl:text-xl">
        My recent pins
      </h3>
      <div className="flex flex-col gap-2">
        {recentPins?.length === 0 && "No pins"}
        {recentPins?.map((item) => (
          <img
            key={item._id}
            className="cursor-pointer w-[240px] h-[140px]"
            src={urlFor(item.image).url()}
            alt="user-post"
            onClick={() => navigate(`/pin-detail/${item?._id}`)}
          />
        ))}
      </div>
      <h3 className="mt-8 font-bold mb-2 text-base 2xl:text-xl">
        My liked pins
      </h3>
      <div className="flex flex-col gap-2">
        {recentLikedPins?.length === 0 && "No pins"}
        {recentLikedPins?.map((item) => (
          <img
            key={item._id}
            className="cursor-pointer w-[240px] h-[140px]"
            src={urlFor(item.image).url()}
            alt="user-post"
            onClick={() => navigate(`/pin-detail/${item?._id}`)}
          />
        ))}
      </div>
    </>
  );
};

export default RightNav;
