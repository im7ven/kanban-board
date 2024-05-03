import React, { useRef } from "react";
import useTaskBoards from "../hooks/useTaskBoards";
import useActiveTaskBorad from "../zustand/store";
import { Task } from "@prisma/client";

const TaskBoard = ({ sidebar }: { sidebar: boolean }) => {
  const { taskBoards } = useTaskBoards();
  const { activeBoard } = useActiveTaskBorad();

  const selectedBoard = taskBoards?.find((board) => board === activeBoard);
  console.log(selectedBoard?.columns);

  return (
    <div
      className={`bg-base-300 gap-6 flex md:border-l border-zinc-600 p-4 overflow-x-auto boardContainerHeight  ${
        sidebar ? "" : "col-span-2"
      }`}
    >
      {selectedBoard?.columns.map((col, index) => (
        <div key={index} className="w-[17.5rem]">
          <h2 className="relative">{col.title}</h2>
          {col.tasks.map((task) => (
            <div className=" space-y-5 bg-neutral rounded-lg p-4 ">
              <h3 className="text-white font-bold">{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
