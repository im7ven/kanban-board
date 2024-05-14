import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import useActiveTaskBoard from "../zustand/store";

const BoardOption = ({ onEdit }: { onEdit: () => void }) => {
  const deleteBoardModal = useRef<HTMLDialogElement>(null);
  const { activeBoard } = useActiveTaskBoard();

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
        className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52 space-y-3"
      >
        <li
          onClick={() => onEdit()}
          className="hover:bg-base-100 p-2 rounded-lg cursor-pointer"
        >
          Edit Board
        </li>
        <li
          onClick={() => deleteBoardModal.current?.showModal()}
          className="text-red-500 hover:bg-base-100 p-2 rounded-lg cursor-pointer"
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
  const { activeBoard } = useActiveTaskBoard();
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
      },
    }
  );

  const boardName = activeBoard?.title;

  const onCancel = () => {
    deleteBoardModal.current?.close();
  };

  return (
    <dialog ref={deleteBoardModal} id="deleteBoardModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-white">Delete this board?</h3>
        <p className="py-4">{`Are you sure you want to delete the "${boardName}"? This action will delete any columns, tasks, and subtasks created within this board and cannot be reversed.`}</p>
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
