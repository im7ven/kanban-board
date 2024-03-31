"use client";

import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";

export default function Home() {
  const [showSideBar, setShowSideBar] = useState(true);

  const handleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <main className="h-screen flex flex-col">
      <div className="h-[8rem] flex">
        <h1 className="w-[28rem]">LOGO</h1>
        <div className="grow md:border-l-[1px]  border-zinc-600">Menu Bar</div>
      </div>
      <div className="flex-1 grid md:grid-cols-[28rem_auto]">
        {showSideBar ? (
          <div className="hidden md:block md:bg-slate-900">
            <h2>Side Menu</h2>
            <button onClick={handleShowSideBar} className="btn">
              Hide Side Bar
            </button>
          </div>
        ) : (
          <button
            onClick={handleShowSideBar}
            className=" hidden md:flex bg-primary h-[4rem] rounded-r-full w-[6rem] absolute left-0 bottom-[3.2rem]  justify-center items-center"
          >
            <AiOutlineEye color="#fff" size="20px" />
          </button>
        )}
        <div
          className={`border-t-[1px]  md:border-l-[1px]  border-zinc-600 ${
            showSideBar ? "" : "col-span-2"
          }`}
        >
          <h2>Task Boards</h2>
        </div>
      </div>
    </main>
  );
}
