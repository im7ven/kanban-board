import React, { useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { Task } from "../types";
import useTheme from "../zustand/themeStore";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { updateTaskSchema } from "../validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import useActiveTaskBoard from "../zustand/store";
import { RiCloseLine } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Props {
  task: Task;
  onOpen: () => void;
}

type UpdateTaskForm = z.infer<typeof updateTaskSchema>;

const EditTaskModal = ({ onOpen, task }: Props) => {
  const editModalRef = useRef<HTMLDialogElement>(null);
  const { activeTheme } = useTheme();
  const queryClient = useQueryClient();

  const updateTask = async (data: UpdateTaskForm) => {
    console.log("API call with data:", data);
    const response = await axios.patch(
      `/api/tasks/${task.id.toString()}`,
      data
    );
    return response.data;
  };

  const mutation = useMutation(updateTask, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["taskBoards"],
      });
      reset(data);
      replace([]);
      editModalRef.current?.close();
    },
  });

  const existingSubtasks = task.subtasks.map(({ id, description }) => ({
    id,
    description,
  }));

  const { register, control, handleSubmit, reset } = useForm<UpdateTaskForm>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      subtasks: existingSubtasks,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    name: "subtasks",
    control,
  });

  const handleOpenEditForm = () => {
    onOpen();
    editModalRef.current?.showModal();
  };

  const onSubmit = (data: UpdateTaskForm) => {
    console.log("Form data being submitted:", data);
    mutation.mutate(data);
  };

  return (
    <div>
      <details className="dropdown dropdown-end">
        <summary className="btn m-1 outline-none btn-ghost">
          <SlOptionsVertical />
        </summary>
        <ul
          className={`dropdown-content z-[1] menu p-2 shadow rounded w-52 text-left ${
            activeTheme === "myTheme" ? "bg-white" : "bg-neutral"
          }`}
        >
          <li
            onClick={handleOpenEditForm}
            className="hover:font-bold p-2 rounded-lg cursor-pointer"
          >
            Edit Task
          </li>
          <li className="text-red-500 hover:font-bold p-2 rounded-lg cursor-pointer">
            Delete Task
          </li>
        </ul>
      </details>

      <dialog ref={editModalRef} id="editModalRef" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{`Edit - ${task.title}`}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="form-control w-full mb-3">
              <div className="label">
                <span className="label-text">Title</span>
              </div>
              <input
                {...register("title")}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
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
            </label>
            <div>
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="flex items-end gap-3">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Subtask</span>
                      </div>
                      <input
                        {...register(`subtasks.${index}.description` as const)}
                        type="text"
                        placeholder="e.g. Refactor"
                        className="input input-bordered w-full"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn"
                    >
                      <RiCloseLine size="20" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline w-full my-3"
                onClick={() => append({ description: "" })}
              >
                Add Subtask
              </button>
              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  className="btn grow"
                  onClick={() => editModalRef.current?.close()}
                >
                  Cancel
                </button>
                <button className="btn grow btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <div
          className="modal-backdrop"
          onClick={() => editModalRef.current?.close()}
        ></div>
      </dialog>
    </div>
  );
};

export default EditTaskModal;
