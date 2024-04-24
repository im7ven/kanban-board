import React, { useEffect, useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { TaskBoard } from "@prisma/client";
import { CgBoard } from "react-icons/cg";
import NewTaskBoardModal from "./NewTaskBoardModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TaskBoardMenu = ({ onShowSideBar }: { onShowSideBar?: () => void }) => {
  const { status } = useSession();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    if (status === "authenticated") {
      setAuthenticated(true);
    } else if (status === "loading") {
      setAuthenticated(null);
    } else {
      setAuthenticated(false);
    }
  }, [status]);

  const {
    data: taskBoards,
    isError,
    isLoading,
  } = useQuery<TaskBoard[]>({
    queryKey: ["taskBoards"],
    queryFn: () =>
      axios
        .get("api/task-boards")
        .then((res) => res.data)
        .catch((error) => {
          throw new Error(
            error.response?.data?.message || "Failed to fetch task boards."
          );
        }),
    staleTime: 60 * 1000,
    retry: 3,
    enabled: authenticated === true,
  });

  if (authenticated === null) {
    // If authentication status is still unknown, show loading spinner
    return <div className="ml-3 loading loading-spinner text-secondary"></div>;
  }

  if (authenticated === false) {
    return <p>Please sign in to view taskBoards</p>;
  }

  console.log("HERE!!!", authenticated);

  return (
    <div className="flex flex-col md:flex-1">
      <div className="md:flex-1">
        <h2 className="mb-3 ml-3">All Boards ({taskBoards?.length})</h2>

        <ul>
          {isLoading && (
            <span className="ml-3 loading loading-spinner text-secondary"></span>
          )}
          {isError ? (
            <p className="text-warning ml-3">
              Sorry an unexpected error has occurred.
            </p>
          ) : (
            taskBoards?.map((board) => (
              <li
                className=" hover:bg-slate-600 rounded-r-full py-2 text-white cursor-pointer"
                key={board.id}
              >
                <button className="flex items-center ml-3 gap-1">
                  <CgBoard size="20" />
                  {board.title}
                </button>
              </li>
            ))
          )}
        </ul>
        <NewTaskBoardModal />
      </div>
      <div className="text-center">Theme Switch</div>
      <button
        onClick={onShowSideBar}
        className="items-align hidden md:flex btn ml-3"
      >
        <AiOutlineEyeInvisible />
        Hide Side Bar
      </button>
    </div>
  );
};

export default TaskBoardMenu;
