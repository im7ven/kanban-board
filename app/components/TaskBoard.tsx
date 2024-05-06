import React, { useRef } from "react";
import useTaskBoards from "../hooks/useTaskBoards";
import useActiveTaskBorad from "../zustand/store";
import { Task, Column } from "../types";

const ColumnComponent: React.FC<{ column: Column }> = ({ column }) => {
  return (
    <div className="w-[17.5rem] space-y-5">
      <h2 className="tracking-widest uppercase">{column.title}</h2>
      {column.tasks.map((task) => (
        <TaskComponent key={task.id} task={task} />
      ))}
    </div>
  );
};

const TaskComponent: React.FC<{ task: Task }> = ({ task }) => {
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

const TaskBoard = ({ sidebar }: { sidebar: boolean }) => {
  const { taskBoards } = useTaskBoards();
  const { activeBoard } = useActiveTaskBorad();

  const selectedBoard = taskBoards?.find((board) => board === activeBoard);
  console.log(selectedBoard?.columns);

  return (
    <div
      className={`bg-base-300 gap-6 flex  p-4 overflow-x-auto boardContainerHeight  ${
        sidebar ? "" : "col-span-2"
      }`}
    >
      {selectedBoard?.columns.map((col) => (
        <ColumnComponent key={col.id} column={col} />
      ))}
    </div>
  );
};

export default TaskBoard;
