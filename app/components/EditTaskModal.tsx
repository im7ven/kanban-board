import React, { useEffect, useState } from "react";
import useActiveTaskBoard from "../zustand/store";
import axios from "axios";
import { useForm, useFieldArray, FormState } from "react-hook-form";
import { z } from "zod";
import { updateTaskBoardSchema } from "../validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiCloseLine } from "react-icons/ri";
import ValidationError from "./ValidationError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  editModalRef: React.RefObject<HTMLDialogElement>;
}

interface Column {
  id?: number;
  title: string;
}

type EditTaskBoardForm = z.infer<typeof updateTaskBoardSchema>;

const EditTaskModal: React.FC<Props> = ({ editModalRef }) => {
  const { activeBoard } = useActiveTaskBoard();
  const [existingColumns, setExistingColumns] = useState<Column[]>([]);
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskBoardForm>({
    resolver: zodResolver(updateTaskBoardSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "columns",
    control,
  });

  const updateTaskBoard = async (data: EditTaskBoardForm) => {
    await axios.patch(`/api/task-boards/${activeBoard?.id.toString()}`, data);
  };

  const mutation = useMutation(updateTaskBoard, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskBoards"],
      });
      editModalRef.current?.close();
    },
  });

  useEffect(() => {
    const existingColumns: Column[] = activeBoard
      ? activeBoard.columns.map(({ id, title }) => ({ id, title }))
      : [];
    setExistingColumns(existingColumns);
  }, [activeBoard]);

  useEffect(() => {
    const defaultValues = {
      title: activeBoard?.title || "",
      columns: existingColumns,
    };
    reset(defaultValues);
  }, [existingColumns, activeBoard]);

  const onSubmit = async (data: EditTaskBoardForm) => {
    mutation.mutate(data);
  };

  console.log(activeBoard?.columns);
  return (
    <div>
      <dialog ref={editModalRef} id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-white">{`Editing - "${activeBoard?.title}"`}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Title</span>
              </div>
              <input
                {...register("title")}
                type="text"
                className="input input-bordered w-full"
              />
            </label>
            {errors.title?.message && (
              <ValidationError errorMessage={errors.title.message} />
            )}

            <div className="my-3">
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <div className="flex items-end gap-3">
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text">Column</span>
                        </div>
                        <input
                          {...register(`columns.${index}.title` as const)}
                          type="text"
                          placeholder="e.g. Refactor"
                          className="input input-bordered w-full "
                        />
                      </label>

                      <button onClick={() => remove(index)} className="btn">
                        <RiCloseLine size="20" />
                      </button>
                    </div>
                    {errors.columns?.[index]?.title?.message && (
                      <ValidationError
                        errorMessage={errors.columns?.[index]?.title?.message}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <button
              className="btn btn-outline w-full"
              onClick={() => append({ title: "" })}
              type="button"
            >
              +Add New Column
            </button>
            <div className="flex gap-3 mt-3">
              <button className="btn grow">Cancel</button>
              <button className="btn grow btn-primary" type="submit">
                SUBMIT
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

export default EditTaskModal;
