import React from "react";
import Image from "next/image";
import { BiMessage, BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
const FeedCard: React.FC = () => {
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-700 transition-all cursor-pointer">
      <div className="grid grid-cols-12">
        <div className="col-span-1 rounded-full">
          <Image
            src="https://avatars.githubusercontent.com/u/104413900?v=4"
            alt="user-image"
            height={50}
            width={50}
            className="rounded-full pr-2"
          />
        </div>
        <div className="col-span-11 gap-5 pl-4">
          <div>
            <h5>ravi</h5>
            <p className="flex justify-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
              blanditiis quia, ducimus itaque dolorum odit ab obcaecati, alias
              praesentium non temporibus eos sequi eveniet rerum! Amet explicabo
              reprehenderit earum nostrum.
            </p>
            <div className="flex justify-between p-2 mt-5 text-xl items-center w-[90%]">
              <div>
                <BiMessageRounded />
              </div>
              <div>
                <FaRetweet />
              </div>
              <div>
                <AiOutlineHeart />
              </div>
              <div>
                <BiUpload />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
