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
  const { activeBoard } = useActiveTaskBorad();
  const { taskBoards } = useTaskBoards();

  console.log(activeBoard);
  console.log(activeBoard?.columns?.length);
  return (
    <div
      className={`bg-base-300 gap-6 flex p-4 overflow-x-auto overflow-y-auto boardContainerHeight ${
        isSideBarVisible ? "boardContainerWidth" : "w-[100vw] pl-[5rem]"
      } ${
        (taskBoards && taskBoards.length < 1) ||
        (activeBoard && activeBoard?.columns.length < 1)
          ? "justify-center items-center"
          : ""
      }`}
    >
      {taskBoards && taskBoards.length < 1 ? (
        <p className="text-white text-lg text-center">
          You Currently have no boards. Create a new board to get started.
        </p>
      ) : activeBoard && activeBoard?.columns.length < 1 ? (
        <div className="flex flex-col justify-center gap-3">
          <p
            className="text-white text-lg text-center
          "
          >
            This board is empty. Create a new column to get started.
          </p>
          <button className="btn btn-primary max-w-full mx-auto">
            +Add New Column
          </button>
        </div>
      ) : (
        activeBoard?.columns.map((col) => (
          <ColumnComponent key={col.id} column={col} />
        ))
      )}
    </div>
  );
};

export default TaskBoard;
