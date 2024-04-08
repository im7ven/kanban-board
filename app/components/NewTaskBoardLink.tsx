"use client";
import { CgBoard } from "react-icons/cg";

const NewTaskBoardLink = () => {
  return (
    <div className="flex items-center gap-1 ml-3 mt-2">
      <CgBoard size="20" />
      <a className="link link-hover link-secondary ">Create New Board</a>
    </div>
  );
};

export default NewTaskBoardLink;
