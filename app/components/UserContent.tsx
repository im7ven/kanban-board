"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TaskBoard from "./TaskBoard";
import MenuBar from "./MenuBar";

const UserContent = () => {
  const [showSideBar, setShowSideBar] = useState(true);

  const handleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className="flex ">
      <Sidebar sidebar={showSideBar} onShowSideBar={handleShowSideBar} />
      <div className={`flex-1 ${showSideBar ? "" : "col-span-2"}`}>
        <MenuBar />
        <TaskBoard isSideBarVisible={showSideBar} />
      </div>
    </div>
  );
};

export default UserContent;
