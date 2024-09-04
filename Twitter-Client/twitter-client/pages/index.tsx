import Image from "next/image";

import { BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import React from "react";
import { BiBell, BiHash, BiHomeCircle, BiUser } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { SlOptions } from "react-icons/sl";

interface TwitterSidebarButtons {
  title : string
  icon : React.ReactNode
}

const sidebarMenuItems : TwitterSidebarButtons [] = [
  {
    title : "Home",
    icon : <BiHomeCircle/>
  },
  {
    title : "Explore",
    icon : <BiHash/>
  },
  {
    title : "Notifications",
    icon : <BiBell/>
  },
  {
    title : "Messages",
    icon : <BsEnvelope/>
  },
  {
    title : "Bookmarks",
    icon : <BsBookmark/> 
  },
  {
    title : "Profile",
    icon : <BiUser/> 
  },
  {
    title : "More Options",
    icon : <SlOptions/> 
  }
]

export default function Home() {
  return (
    <div >
      <div className="grid grid-cols-12 h-screen w-screen px-56 ">
        <div className="col-span-3 pl-14 pt-8">
          <div className=" text-4xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <BsTwitter className=" "/>
          </div>
          <div className=" mt-4 text-xl pr-4">
            <ul>
            {sidebarMenuItems.map( item => <li className="w-fit px-5 py-2 flex justify-start items-center gap-4 rounded-full transition-all hover:bg-gray-800" key={item.title}><span>{item.icon}</span><span>{item.title}</span></li>)}
            </ul>
            <div className="mt-5 px-10">
              <button className="bg-[#1d9bf0] font-semibold p-4 text-lg rounded-full w-full ">Tweet</button>
            </div>
          </div>
        </div>
        <div className="col-span-5 border-r-[1px]  border-l-[1px] h-screen  overflow-auto noscrollbar border-gray-600 ">
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>
            <FeedCard/>

        </div>
        <div className="col-span-4">
          
        </div>  
      </div>
    </div>
  );
}
