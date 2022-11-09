import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";

const breakpointColumnsObj = {
  default: 2,
  3000: 2,
  2000: 1,
  1200: 1,
  500: 1,
};

const MasonryLayout = ({ pins }) => (
  <Masonry
    className="flex animate-slide-fwd"
    breakpointCols={breakpointColumnsObj}
  >
    {pins?.map((pin) => (
      <Pin key={pin._id} pin={pin} className="w-max" />
    ))}
  </Masonry>
);

export default MasonryLayout;
