import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SlOptionsVertical } from "react-icons/sl";
import useActiveTaskBorad from "../zustand/store";
import useTaskBoards from "../hooks/useTaskBoards";
import { createTaskSchema } from "../validationSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ValidationError from "./ValidationError";

type TaskForm = z.infer<typeof createTaskSchema>;

const NewTaskModal = () => {
  const newTaskModal = useRef<HTMLDialogElement>(null);
  const { activeBoard } = useActiveTaskBorad();
  const { taskBoards } = useTaskBoards();
  const queryClient = useQueryClient();
  const [subTasks, setSubTasks] = useState<number[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(createTaskSchema),
  });

  const { mutate: createTask } = useMutation<void, unknown, TaskForm>(
    async (newTaskData: TaskForm) => {
      await axios.post("/api/tasks", newTaskData);
    }
  );

  const handleAddSubTask = () => {
    const uniqueNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    setSubTasks((prevColumns) => [...prevColumns, uniqueNumber]);
  };

  const currentBoard = taskBoards?.find((board) => board === activeBoard);

  const onSubmit = (data: TaskForm) => {
    console.log(data);
    createTask(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["taskBoards"],
        });
        reset();
        setSubTasks([]);
        newTaskModal.current?.close();
      },
    });
  };

  const handleCancel = () => {
    newTaskModal.current?.close();
    clearErrors("title");
    reset();
    setSubTasks([]);
  };

  return (
    <div className="space-x-3">
      <button
        onClick={() => newTaskModal.current?.showModal()}
        // disabled={true}
        className="btn btn-primary"
      >
        Add Task
      </button>
      <button>
        <SlOptionsVertical />
      </button>
      <dialog ref={newTaskModal} id="newTaskModal" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-white font-bold mb-3">Add New Task</h2>

            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Title</span>
              </div>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g. Take a 15 minute break"
                className="input input-bordered"
              />
              {errors.title?.message && (
                <ValidationError errorMessage={errors.title.message} />
              )}
            </label>
            <label className="form-control mb-6">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <textarea
                {...register("description")}
                className="textarea textarea-bordered h-24"
                placeholder="e.g. It is always a good idea to take a break to refresh the body and mind"
              ></textarea>
              {errors.description?.message && (
                <ValidationError errorMessage={errors.description.message} />
              )}
            </label>

            {subTasks.length > 0 && <h3 className="mt-3">Subtasks</h3>}
            {subTasks.map((task, index) => (
              <div key={task} className="my-2">
                <label className=" flex-1 input input-bordered flex items-center gap-2">
                  Subtask
                  <input
                    type="text"
                    className="grow"
                    {...register(`subtasks.${index}`, {
                      required: false,
                    })}
                  />
                </label>
                {errors.subtasks?.[index] && (
                  <ValidationError
                    errorMessage={errors.subtasks[index].message!}
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline w-full mb-3"
              onClick={handleAddSubTask}
            >
              Add Subtask
            </button>

            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Status</span>
              </div>
              <select
                {...register("columnId")}
                className="select select-bordered"
              >
                {currentBoard?.columns.map((col) => (
                  <option value={col.id} key={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                type="button"
                className="btn btn-danger grow "
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary grow">
                Submit Task
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default NewTaskModal;
