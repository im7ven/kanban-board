"use client";
import { useRef, useState } from "react";
import { CgBoard } from "react-icons/cg";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskBoardSchema } from "../validationSchemas";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

type TaskBoardForm = z.infer<typeof createTaskBoardSchema>;

const NewTaskBoardModal = () => {
  const newTaskBoardModal = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<TaskBoardForm>({
    resolver: zodResolver(createTaskBoardSchema),
  });
  const [columns, setColumns] = useState<number[]>([]);

  const handleAddColumn = () => {
    const uniqueNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    setColumns((prevColumns) => [...prevColumns, uniqueNumber]);
  };

  const handleCancel = () => {
    newTaskBoardModal.current?.close();
    clearErrors("title");
    reset();
    setColumns([]);
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
              reset();
              setColumns([]);
              newTaskBoardModal.current?.close();
            })}
          >
            <label className="input input-bordered flex items-center gap-2">
              Title
              <input {...register("title")} type="text" className="grow" />
            </label>
            {errors.title && errors.title.type === "required" && (
              <div role="alert" className="mt-2 alert alert-error">
                <span>{errors.title.message}</span>
              </div>
            )}

            {columns.length > 0 && <h3 className="mt-3">Columns</h3>}

            {columns.map((column, index) => (
              <div key={column} className="flex gap-2 items-center">
                <label className="flex-1 input input-bordered flex items-center gap-2">
                  Title
                  <input
                    type="text"
                    className="grow"
                    {...register(`columns.${index}`, {
                      required: false,
                    })}
                  />
                </label>
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
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  type="submit"
                  className="btn btn-danger grow "
                >
                  Cancel
                </button>
                <button className="btn btn-primary grow">
                  Submit Task Board
                </button>
              </div>
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
