import React, { useEffect, useRef } from "react";
import { getImageUrl } from "../utils/getImageUrl";
import dp from "../assets/dp.png";
import { useSelector } from "react-redux";

function ReceiverMessages({ image, message }) {
  const imageUrl = getImageUrl(image);
  const { selectedUser } = useSelector((state) => state.user);
  const scroll = useRef(null);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, image]);

  return (
    <div ref={scroll} className="flex items-end gap-2 mb-1">
      {/* Receiver profile image */}
      <div
        className="bg-white w-[40px] h-[40px] overflow-hidden rounded-full flex justify-center items-center 
        shadow-gray-500 shadow-lg border border-white hover:shadow-inner"
      >
        <img
          src={selectedUser?.image || dp}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Message bubble (image always on top, text below) */}
      <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%]">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="received"
            className="w-[180px] h-[180px] rounded-lg object-cover shadow-gray-400 shadow-md mb-2"
          />
        )}

        {message && (
          <span
            className="break-words break-all whitespace-pre-wrap w-fit px-3 sm:px-4 py-2 font-semibold text-white 
            rounded-tl-none rounded-2xl bg-[#0582ab] shadow-gray-400 shadow-lg text-sm sm:text-base"
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

export default ReceiverMessages;
