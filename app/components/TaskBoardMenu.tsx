import React, { useEffect, useState } from "react";
import NewTaskBoardLink from "./NewTaskBoardLink";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { TaskBoard } from "@prisma/client";
import { CgBoard } from "react-icons/cg";

const TaskBoardMenu = ({ onShowSideBar }: { onShowSideBar?: () => void }) => {
  const [taskBoards, setTaskBoards] = useState<TaskBoard[]>([]);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchTaskBoards = async () => {
      try {
        const res = await fetch("/api/task-boards");
        if (res.ok) {
          const taskBoardData = await res.json();
          setTaskBoards(taskBoardData);
        }
      } catch (error) {
        console.error("Failed to fetch task boards", error);
      }
    };

    if (session) {
      fetchTaskBoards();
    }
  }, [session]);

  return (
    <div className="flex flex-col md:flex-1">
      <div className="md:flex-1">
        <h2 className="mb-3 ml-3">All Boards ({taskBoards.length})</h2>
        <ul>
          {taskBoards.map((board) => (
            <li
              className=" hover:bg-slate-600 rounded-r-full py-2 text-white cursor-pointer"
              key={board.id}
            >
              <button className="flex items-center ml-3 gap-1">
                <CgBoard size="20" />
                {board.title}
              </button>
            </li>
          ))}
        </ul>
        <NewTaskBoardLink />
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
