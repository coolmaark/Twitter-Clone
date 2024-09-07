import React from "react";
import Image from "next/image";
import { BiMessage, BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-700 transition-all cursor-pointer">
      <div className="grid grid-cols-12">
        <div className="col-span-1 rounded-full">
          {data.author?.profileImageURL && (
            <Image
              src={data.author?.profileImageURL}
              alt="user-image"
              height={50}
              width={50}
              className="rounded-full "
            />
          )}
        </div>
        <div className="col-span-11 gap-5 pl-4">
          <div>
            <h5>
              <Link href={`/${data.author?.id}`}>
                {data.author?.firstName} {data.author?.LastName}
              </Link>
            </h5>
            <p className="flex justify-start ">{data.content}</p>
            {
              data.imageURL && <Image src={data.imageURL} alt="image" width={400} height={400}/>
            }
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
