// client/src/components/Rating.jsx
import React from "react";
import { IoStarOutline, IoStarHalfOutline, IoStar } from "react-icons/io5";

const Rating = ({ value, text }) => {
  // value is the string and text is the num of reviews.
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;

    if (value >= starValue) {
      return <IoStar key={index} />;
    } else if (value >= starValue - 0.5) {
      return <IoStarHalfOutline key={index} />;
    } else {
      return <IoStarOutline key={index} />;
    }
  });

  return (
    <div className="rating">
      {stars}
      <span className="rating-text">{text && text}</span>
    </div>
  );
};

export default Rating;
