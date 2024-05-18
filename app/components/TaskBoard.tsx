import useTaskBoards from "../hooks/useTaskBoards";
import useActiveTaskBoard from "../zustand/store";
import { Task, Column } from "../types";
import { useRef, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { link } from "fs";
import { updateSubtaskStatus, updateTaskStatus } from "../serverActions";
import { useQueryClient } from "@tanstack/react-query";

interface TaskBoardProps {
  isSideBarVisible: boolean;
  onEdit: () => void;
}

const ColumnComponent = ({ column }: { column: Column }) => {
  return (
    <div className="min-w-[17.5rem] space-y-5">
      <h2 className="tracking-widest uppercase">{column.title}</h2>
      {column.tasks.map((task) => (
        <TaskComponent key={task.id} task={task} />
      ))}
    </div>
  );
};

const TaskComponent = ({ task }: { task: Task }) => {
  const [localTask, setLocalTask] = useState(task);
  const editTaskModal = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const { activeBoard } = useActiveTaskBoard();

  const handleSubtaskStatusChange = async (subtaskId: number) => {
    const subtaskIndex = localTask.subtasks.findIndex(
      (sub) => sub.id === subtaskId
    );
    const updatedSubtasks = [...localTask.subtasks];
    updatedSubtasks[subtaskIndex].status =
      !updatedSubtasks[subtaskIndex].status;

    await updateSubtaskStatus(subtaskId, updatedSubtasks[subtaskIndex].status);
    setLocalTask({ ...localTask, subtasks: updatedSubtasks });
  };

  const handleTaskStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newColumnId = parseInt(e.target.value);

    await updateTaskStatus(localTask.id, newColumnId);
    setLocalTask({
      ...localTask,
      column: { ...localTask.column, id: newColumnId },
    });
    queryClient.invalidateQueries(["taskBoards"]);
  };

  return (
    <>
      <dialog ref={editTaskModal} id="editTaskModal" className="modal">
        <div className="modal-box">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg text-white">{localTask.title}</h3>
            <button>
              <SlOptionsVertical />
            </button>
          </div>
          <p className="py-4">{localTask.description}</p>
          <p className="my-3 text-sm">
            {`Subtasks (${
              localTask.subtasks.filter((sub) => sub.status).length
            } / ${localTask.subtasks.length})`}
          </p>
          <ul className="space-y-2">
            {localTask.subtasks.map((sub) => (
              <li
                className={`p-2 bg-base-200 rounded-md ${
                  sub.status === true ? "line-through" : ""
                }`}
                key={sub.id}
              >
                <div className="form-control flex items-start space-x-4">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary rounded-none"
                      checked={sub.status}
                      onChange={() => handleSubtaskStatusChange(sub.id)}
                    />
                    <p className="label-text ml-3">{sub.description}</p>
                  </label>
                </div>
              </li>
            ))}
          </ul>

          <label className="form-control w-full mt-3">
            <div className="label">
              <span className="label-text">Current Status</span>
            </div>
            <select
              className="select select-bordered"
              value={localTask.column.id.toString()}
              onChange={handleTaskStatusChange}
            >
              {/* Add options dynamically based on columns */}
              {activeBoard?.columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div
        onClick={() => editTaskModal.current?.showModal()}
        className="space-y-5 bg-neutral rounded-lg p-4 shadow-xl"
      >
        <h3 className="text-white font-bold text-md">{localTask.title}</h3>
        <p className="text-sm">{`${
          localTask.subtasks.filter((sub) => sub.status).length
        }/${localTask.subtasks.length} Subtasks Completed`}</p>
      </div>
    </>
  );
};

const TaskBoard = ({ isSideBarVisible, onEdit }: TaskBoardProps) => {
  const { activeBoard } = useActiveTaskBoard();
  const { taskBoards } = useTaskBoards();

  return (
    <div
      className={`bg-base-300 gap-6 flex p-4 overflow-x-auto overflow-y-auto boardContainerHeight ${
        isSideBarVisible ? "boardContainerWidth" : "w-[100vw] pl-[5rem]"
      } ${
        (taskBoards && taskBoards.length < 1) ||
        (activeBoard && activeBoard?.columns.length < 1)
          ? "justify-center items-center"
          : ""
      }`}
    >
      {taskBoards && taskBoards.length < 1 ? (
        <p className="text-white text-lg text-center">
          You Currently have no boards. Create a new board to get started.
        </p>
      ) : activeBoard && activeBoard?.columns.length < 1 ? (
        <div className="flex flex-col justify-center gap-3">
          <p
            className="text-white text-lg text-center
          "
          >
            This board is empty. Create a new column to get started.
          </p>
          <button
            onClick={() => onEdit()}
            className="btn btn-primary max-w-full mx-auto"
          >
            +Add New Column
          </button>
        </div>
      ) : (
        activeBoard?.columns.map((col) => (
          <ColumnComponent key={col.id} column={col} />
        ))
      )}
    </div>
  );
};

export default TaskBoard;
