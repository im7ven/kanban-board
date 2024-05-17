"use client";

import { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import TaskBoard from "./TaskBoard";
import MenuBar from "./MenuBar";
import EditTaskBoardModal from "./EditTaskBoardModal";

const UserContent = () => {
  const [showSideBar, setShowSideBar] = useState(true);

  const handleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  const editModalRef = useRef<HTMLDialogElement>(null);

  const handleOpenEditModal = () => {
    editModalRef.current?.showModal();
  };

  return (
    <div className="flex ">
      <Sidebar sidebar={showSideBar} onShowSideBar={handleShowSideBar} />
      <div className={`flex-1 ${showSideBar ? "" : "col-span-2"}`}>
        <EditTaskBoardModal editModalRef={editModalRef} />
        <MenuBar onEdit={handleOpenEditModal} />
        <TaskBoard
          onEdit={handleOpenEditModal}
          isSideBarVisible={showSideBar}
        />
      </div>
    </div>
  );
};

export default UserContent;
