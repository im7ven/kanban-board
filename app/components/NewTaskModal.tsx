import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SlOptionsVertical } from "react-icons/sl";
import useActiveTaskBorad from "../zustand/store";
import useTaskBoards from "../hooks/useTaskBoards";
import { createTaskSchema } from "../validationSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ValidationError from "./ValidationError";

type TaskForm = z.infer<typeof createTaskSchema>;

const NewTaskModal = () => {
  const newTaskModal = useRef<HTMLDialogElement>(null);
  const { activeBoard } = useActiveTaskBorad();
  const { taskBoards } = useTaskBoards();
  const [subTasks, setSubTasks] = useState<number[]>([]);
  const {
    register,
    handleSubmit,
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
    createTask(data);
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
            <label className=" flex-1 input input-bordered flex items-center gap-2 mb-3">
              Title
              <input {...register("title")} type="text" className="grow" />
            </label>
            <textarea
              {...register("description")}
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Description"
            ></textarea>
            {subTasks.length > 0 && <h3 className="mt-3">SubTasks</h3>}

            {subTasks.map((task, index) => (
              <div key={task} className="my-2">
                <label className=" flex-1 input input-bordered flex items-center gap-2">
                  SubTask
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
              className="btn btn-outline w-full mb-3"
              onClick={handleAddSubTask}
            >
              Add Subtask
            </button>

            <select
              {...register("columnId")}
              className="select select-bordered w-full  mb-3"
              defaultValue="Status"
            >
              <option defaultValue="Status" disabled>
                Status
              </option>
              {currentBoard?.columns.map((col) => (
                <option value={col.id} key={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
            <div className="flex space-x-3">
              <button type="button" className="btn btn-danger grow ">
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
