import React, { useEffect, useState } from "react";
import useActiveTaskBoard from "../zustand/store";
import axios from "axios";
import useTaskBoards from "../hooks/useTaskBoards";
import { useForm } from "react-hook-form";

interface Props {
  editModalRef: React.RefObject<HTMLDialogElement>;
}

interface Column {
  id?: number;
  title: string;
}

const EditTaskModal: React.FC<Props> = ({ editModalRef }) => {
  const { activeBoard } = useActiveTaskBoard();
  const { taskBoards } = useTaskBoards();
  const [title, setTitle] = useState<string>(activeBoard?.title || "");
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  const [columns, setColumns] = useState<Column[]>(activeBoard?.columns || []);

  const { register } = useForm();

  useEffect(() => {
    setTitle(activeBoard?.title || "");
    setColumns(activeBoard?.columns || []);
  }, [activeBoard]);

  const handleAddColumn = () => {
    if (newColumnTitle.trim() !== "") {
      const newColumn: Column = {
        title: newColumnTitle,
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
    }
  };

  const handleRemoveColumn = (title: string) => {
    setColumns(columns.filter((col) => col.title !== title));
  };

  async function updateTaskBoard(
    taskBoardId: string,
    updatedData: { title: string; columns: Omit<Column, "id">[] }
  ) {
    try {
      const response = await axios.patch(
        `/api/task-boards/${taskBoardId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update task board");
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Identify new columns based on the isNew flag
      const newColumns = columns.filter((col) => col.id);
      const existingColumns = columns.filter((col) => !col.id);

      console.log([...existingColumns, ...newColumns]);

      if (activeBoard) {
        await updateTaskBoard(activeBoard.id.toString(), {
          title,
          columns: [...existingColumns, ...newColumns],
        });
      }

      // Handle success (e.g., close modal)
    } catch (error) {
      console.error("Error updating task board:", error);
      // Handle error (e.g., display error message)
    }
  };

  const handleColumnTitleChange = (title: string, newTitle: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.title === title ? { ...col, title: newTitle } : col
      )
    );
  };

  console.log(taskBoards);

  return (
    <div>
      <dialog ref={editModalRef} id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-white">{`Edit "${activeBoard?.title}" Board`}</h3>
          <form onSubmit={handleSubmit}>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Title</span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            {/* Column inputs */}
            {columns.map((col) => (
              <div key={col.id} className="flex gap-3">
                <label className="input input-bordered flex items-center gap-2">
                  Column
                  <input
                    onChange={(e) =>
                      handleColumnTitleChange(col.title, e.target.value)
                    }
                    defaultValue={col.title}
                    type="text"
                    className="grow"
                  />
                </label>
                <button
                  onClick={() => handleRemoveColumn(col.title)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}
            {/* Input for adding new column */}
            <div>
              <label className="input input-bordered flex items-center gap-2">
                New Column
                <input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  type="text"
                  placeholder="Enter column title"
                  className="grow"
                />
              </label>
              <button
                onClick={handleAddColumn}
                className="btn btn-primary mt-2"
                disabled={!newColumnTitle.trim()}
              >
                Add Column
              </button>
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Submit
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default EditTaskModal;
