import React, { useEffect, useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { CgBoard } from "react-icons/cg";
import NewTaskBoardModal from "./NewTaskBoardModal";
import useTaskBoards from "../hooks/useTaskBoards";
import useActiveTaskBorad from "../zustand/store";

const TaskBoardMenu = ({ onShowSideBar }: { onShowSideBar?: () => void }) => {
  const { isError, isLoading, taskBoards, authenticated } = useTaskBoards();
  const { setIsActive, activeBoard } = useActiveTaskBorad();
  if (authenticated === null) {
    return <div className="ml-3 loading loading-spinner text-secondary"></div>;
  }

  if (authenticated === false) {
    return <p>Please sign in to view taskBoards</p>;
  }

  return (
    <div className="flex flex-col md:flex-1">
      <div className="md:flex-1">
        <h2 className="mb-3 ml-3">All Boards ({taskBoards?.length})</h2>

        <ul>
          {isLoading && (
            <span className="ml-3 loading loading-spinner text-secondary"></span>
          )}
          {isError ? (
            <p className="text-warning ml-3">
              Sorry an unexpected error has occurred.
            </p>
          ) : (
            taskBoards?.map((board) => (
              <li
                className={`rounded-r-full py-3 cursor-pointer ${
                  board === activeBoard ? "bg-primary text-white" : ""
                }${board === activeBoard ? "" : " hover:bg-neutral"}`}
                key={board.id}
                onClick={() => setIsActive(board)}
              >
                <button className="flex items-center ml-3 gap-1">
                  <CgBoard size="20" />
                  {board.title}
                </button>
              </li>
            ))
          )}
        </ul>
        <NewTaskBoardModal />
      </div>
      <div className="text-center">Theme Switch</div>
      <button
        onClick={onShowSideBar}
        className="items-align hidden md:flex btn ml-3"
      >
        <AiOutlineEyeInvisible />
        Hide Side Bar
      </button>
    </div>
  );
};

export default TaskBoardMenu;
