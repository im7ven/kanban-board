"use client";

import { useState } from "react";
import MenuBar from "./components/MenuBar";
import Sidebar from "./components/Sidebar";
import TaskBoard from "./components/TaskBoard";

export default function Home() {
  const [showSideBar, setShowSideBar] = useState(true);

  const handleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <main className="h-screen flex flex-col">
      <div className="h-[4rem] flex md:h-[5rem] lg:h-[6rem] md:border-b-[1px]  border-zinc-600 ">
        <h1 className="md:w-[17rem] lg:w-[19rem]">LOGO</h1>
        <MenuBar />
      </div>
      <div className="md:flex-1 grid md:grid-cols-[17rem_auto] lg:grid-cols-[19rem_auto]">
        <Sidebar sidebar={showSideBar} onShowSideBar={handleShowSideBar} />
        <TaskBoard sidebar={showSideBar} />
      </div>
    </main>
  );
}
