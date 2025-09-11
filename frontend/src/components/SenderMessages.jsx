import React, { useEffect, useRef } from "react";
import { getImageUrl } from "../utils/getImageUrl";
import { useSelector } from "react-redux";
import dp from "../assets/dp.png";

function SenderMessages({ image, message }) {
  const imageUrl = getImageUrl(image);
  const scroll = useRef(null);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, image]);

  return (
    <div ref={scroll} className="flex items-end justify-end gap-2 mb-1">
      {/* Message bubble (image always on top, text below) */}
      <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="sent"
            className="w-[180px] h-[180px] rounded-lg object-cover shadow-gray-400 shadow-md mb-2"
          />
        )}

        {message && (
          <span
            className="break-words break-all whitespace-pre-wrap w-fit px-3 sm:px-4 py-2 font-semibold text-white 
            rounded-tr-none rounded-2xl bg-[#20a6ff] shadow-gray-400 shadow-lg text-sm sm:text-base"
          >
            {message}
          </span>
        )}
      </div>

      {/* Sender profile image */}
      <div
        className="bg-white w-[40px] h-[40px] overflow-hidden rounded-full flex justify-center items-center 
        shadow-gray-500 shadow-lg border border-white hover:shadow-inner"
      >
        <img
          src={userData?.image || dp}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default SenderMessages;
