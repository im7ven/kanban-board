"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TaskBoard from "./TaskBoard";

const UserContent = () => {
  const [showSideBar, setShowSideBar] = useState(true);

  const handleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  return (
    <div className="md:flex-1 grid md:grid-cols-[17rem_auto] lg:grid-cols-[19rem_auto]">
      <Sidebar sidebar={showSideBar} onShowSideBar={handleShowSideBar} />
      <TaskBoard sidebar={showSideBar} />
    </div>
  );
};

export default UserContent;
