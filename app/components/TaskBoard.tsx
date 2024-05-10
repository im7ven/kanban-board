import React, { useRef } from "react";
import useTaskBoards from "../hooks/useTaskBoards";
import useActiveTaskBorad from "../zustand/store";
import { Task, Column } from "../types";

const ColumnComponent = ({ column }: { column: Column }) => {
  return (
    <div className="min-w-[17.5rem] space-y-5">
      <h2 className="tracking-widest uppercase">{column.title}</h2>
      {column.tasks.map((task) => (
        <TaskComponent key={task.id} task={task} />
      ))}
    </div>
  );
};

const TaskComponent = ({ task }: { task: Task }) => {
  return (
    <div className="space-y-5 bg-neutral rounded-lg p-4 shadow-xl">
      <h3 className="text-white font-bold text-md">{task.title}</h3>
      <p className="text-sm">{`${
        task.subtasks.filter((sub) => sub.status === true).length
      }/${task.subtasks.length} Subtasks Completed`}</p>
      {/* Render subtasks here */}
    </div>
  );
};

const TaskBoard = ({ isSideBarVisible }: { isSideBarVisible: boolean }) => {
  const { taskBoards } = useTaskBoards();
  const { activeBoard } = useActiveTaskBorad();

  const selectedBoard = taskBoards?.find(
    (board) => board.id === activeBoard?.id
  );

  return (
    <div
      className={`bg-base-300 gap-6 flex p-4 overflow-x-auto overflow-y-auto boardContainerHeight ${
        isSideBarVisible ? "boardContainerWidth" : "w-[100vw] pl-[5rem]"
      }`}
    >
      {selectedBoard?.columns.map((col) => (
        <ColumnComponent key={col.id} column={col} />
      ))}
    </div>
  );
};

export default TaskBoard;
