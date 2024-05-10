"use client";
import { useRef, useState } from "react";
import { CgBoard } from "react-icons/cg";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskBoardSchema } from "../validationSchemas";
import { z } from "zod";
import ValidationError from "./ValidationError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TaskBoardForm = z.infer<typeof createTaskBoardSchema>;

const NewTaskBoardModal = () => {
  const newTaskBoardModal = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const { mutate: createTaskBoard } = useMutation(
    (newTaskBoardData: { title: string; columns?: string[] }) =>
      axios.post("/api/task-boards", newTaskBoardData)
  );

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

  const onSubmit = (data: TaskBoardForm) => {
    createTaskBoard(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["taskBoards"],
        });
        reset();
        setColumns([]);
        newTaskBoardModal.current?.close();
      },
    });
  };

  return (
    <>
      <div
        onClick={() => newTaskBoardModal.current?.showModal()}
        className="flex items-center gap-1 ml-3 mt-2"
      >
        <CgBoard size="20" />
        <a className="link link-hover link-accent ">+Create New Board</a>
      </div>
      <dialog ref={newTaskBoardModal} id="newTaskBoardModal" className="modal">
        <div className="modal-box">
          <h2 className="mb-3">Create Task Board</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="input input-bordered flex items-center gap-2">
              Title
              <input {...register("title")} type="text" className="grow" />
            </label>
            {errors.title && (
              <ValidationError errorMessage={errors.title.message!} />
            )}

            {columns.length > 0 && <h3 className="mt-3">Columns</h3>}

            {columns.map((column, index) => (
              <div key={column} className="my-2">
                <label className=" flex-1 input input-bordered flex items-center gap-2">
                  Title
                  <input
                    type="text"
                    className="grow"
                    {...register(`columns.${index}`, {
                      required: false,
                    })}
                  />
                </label>
                {errors.columns?.[index] && (
                  <ValidationError
                    errorMessage={errors.columns[index].message!}
                  />
                )}
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
                  type="button"
                  className="btn btn-danger grow "
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary grow">
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
