import React, { useRef } from "react";
import useTaskBoards from "../hooks/useTaskBoards";
import useActiveTaskBorad from "../zustand/store";

const TaskBoard = ({ sidebar }: { sidebar: boolean }) => {
  const { taskBoards } = useTaskBoards();
  const { activeBoard } = useActiveTaskBorad();

  const selectedBoard = taskBoards?.find((board) => board === activeBoard);
  return (
    <div
      className={` gap-6 flex md:border-l border-zinc-600 p-4 overflow-x-auto boardContainerHeight  ${
        sidebar ? "" : "col-span-2"
      }`}
    >
      {selectedBoard?.columns.map((col, index) => (
        <div key={index} className="">
          <h2 className="relative">{col.title}</h2>

          <div className="w-[17.5rem]   space-y-5">
            <div className="bg-white h-[8rem] rounded text-center ">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure
              unde magnam et. Optio, totam.
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
