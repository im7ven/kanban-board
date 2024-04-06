import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import NewTaskBoardLink from "./NewTaskBoardLink";
import TaskBoardMenu from "./TaskBoardMenu";

interface Props {
  sidebar: boolean;
  onShowSideBar: () => void;
}

const Sidebar = ({ sidebar, onShowSideBar }: Props) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSmallScreen) {
    return null;
  }

  return (
    <>
      {sidebar ? (
        <TaskBoardMenu onShowSideBar={onShowSideBar} />
      ) : (
        <button
          onClick={onShowSideBar}
          className=" hidden md:flex bg-primary h-[3rem] rounded-r-full w-[4rem] absolute left-0 bottom-[3.2rem]  justify-center items-center"
        >
          <AiOutlineEye color="#fff" size="20px" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
