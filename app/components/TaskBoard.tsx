import React from "react";

const TaskBoard = ({ sidebar }: { sidebar: boolean }) => {
  return (
    <div
      className={`md:border-l-[1px] border-zinc-600  ${
        sidebar ? "" : "col-span-2"
      }`}
    >
      <h2>Task Boards</h2>
    </div>
  );
};

export default TaskBoard;
