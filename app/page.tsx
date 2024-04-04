"use client";

import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import MenuBar from "./components/MenuBar";

export default function Home() {
  const [showSideBar, setShowSideBar] = useState(true);

  const handleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <main className="h-screen flex flex-col">
      <div className="h-[4rem] flex md:h-[5rem] lg:h-[6rem]">
        <h1 className="md:w-[17rem] lg:w-[19rem]">LOGO</h1>
        <MenuBar />
      </div>
      <div className="flex-1 grid md:grid-cols-[17rem_auto] lg:grid-cols-[19rem_auto]">
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
            className=" hidden md:flex bg-primary h-[3rem] rounded-r-full w-[4rem] absolute left-0 bottom-[3.2rem]  justify-center items-center"
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
