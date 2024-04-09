"use client";
import { useRef, useState } from "react";
import { CgBoard } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";

interface TaskBoardForm {
  title: string;
  columns: string[];
}

const NewTaskBoardModal = () => {
  const newTaskBoardModal = useRef<HTMLDialogElement>(null);
  const { register, handleSubmit } = useForm<TaskBoardForm>();
  const [columns, setColumns] = useState<string[]>([]);

  const handleAddColumn = () => {
    setColumns((prevColumns) => [...prevColumns, ""]);
  };

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index)); // Remove the column input at the specified index
  };

  return (
    <>
      <div
        onClick={() => newTaskBoardModal.current?.showModal()}
        className="flex items-center gap-1 ml-3 mt-2"
      >
        <CgBoard size="20" />
        <a className="link link-hover link-secondary ">+Create New Board</a>
      </div>
      <dialog ref={newTaskBoardModal} id="newTaskBoardModal" className="modal">
        <div className="modal-box">
          <h2 className="mb-3">Create Task Board</h2>
          <form
            onSubmit={handleSubmit((data) => {
              axios.post("/api/task-boards", data);
              newTaskBoardModal.current?.close();
            })}
          >
            <label className="input input-bordered flex items-center gap-2">
              Title
              <input {...register("title")} type="text" className="grow" />
            </label>
            <h3 className="mt-3">Columns</h3>

            {columns.map((column, index) => (
              <div key={index} className="flex gap-2 items-center">
                <label className="flex-1 input input-bordered flex items-center gap-2">
                  Title
                  <input
                    type="text"
                    className="grow"
                    {...register(`columns.${index}`)}
                  />
                </label>
                <AiOutlineClose onClick={() => handleRemoveColumn(index)} />
              </div>
            ))}
            <div className="mt-3 space-y-3">
              <button
                type="button"
                onClick={handleAddColumn}
                className="btn btn-block btn-outline"
              >
                Add New Column
              </button>
              <button type="submit" className="btn btn-primary btn-block">
                Submit Task Board
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default NewTaskBoardModal;
