import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import useActiveTaskBoard from "../zustand/store";
import useTaskBoards from "../hooks/useTaskBoards";
import useTheme from "../zustand/themeStore";

const BoardOption = ({ onEdit }: { onEdit: () => void }) => {
  const deleteBoardModal = useRef<HTMLDialogElement>(null);
  const { activeBoard } = useActiveTaskBoard();
  const { activeTheme } = useTheme();

  return (
    <div className="dropdown">
      <button
        disabled={!activeBoard}
        tabIndex={0}
        role="button"
        className=" m-1"
      >
        <SlOptionsVertical />
      </button>
      <ul
        tabIndex={0}
        className={`dropdown-content z-[1] menu p-2 shadow  rounded-box w-52 ${
          activeTheme === "myTheme" ? "bg-white" : "bg-neutral"
        }`}
      >
        <li
          onClick={() => onEdit()}
          className="hover:font-bold p-2 rounded-lg cursor-pointer"
        >
          Edit Board
        </li>
        <li
          onClick={() => deleteBoardModal.current?.showModal()}
          className="text-red-500 hover:font-bold p-2 rounded-lg cursor-pointer"
        >
          Delete
        </li>
      </ul>
      <DeleteBoardModal deleteBoardModal={deleteBoardModal} />
    </div>
  );
};

const DeleteBoardModal = ({
  deleteBoardModal,
}: {
  deleteBoardModal: React.RefObject<HTMLDialogElement>;
}) => {
  const { activeBoard, setDefaultBoard } = useActiveTaskBoard();
  const { taskBoards } = useTaskBoards();
  const queryClient = useQueryClient();
  const { mutate: deleteBoard } = useMutation(
    async () => {
      if (activeBoard) {
        await axios.delete(`/api/task-boards/${activeBoard.id}`);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["taskBoards"],
        });
        deleteBoardModal.current?.close();
        if (taskBoards) setDefaultBoard(taskBoards);
      },
    }
  );

  const onCancel = () => {
    deleteBoardModal.current?.close();
  };

  return (
    <dialog ref={deleteBoardModal} id="deleteBoardModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-white">Delete this board?</h3>
        <p className="py-4">{`Are you sure you want to delete the "${activeBoard?.title}"? This action will delete any columns, tasks, and subtasks created within this board and cannot be reversed.`}</p>
        <div className="flex gap-3">
          <button className="btn grow" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-error grow" onClick={() => deleteBoard()}>
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default BoardOption;
