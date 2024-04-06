import React from "react";
import NewTaskBoardLink from "./NewTaskBoardLink";

const TaskBoardMenu = ({ onShowSideBar }: { onShowSideBar: () => void }) => {
  return (
    <div>
      <h2>Side Menu</h2>
      <NewTaskBoardLink />
      <button onClick={onShowSideBar} className="btn">
        Hide Side Bar
      </button>
    </div>
  );
};

export default TaskBoardMenu;
