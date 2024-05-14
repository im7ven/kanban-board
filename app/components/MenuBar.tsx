"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { RiArrowDropDownLine } from "react-icons/ri";
import TaskBoardMenu from "./TaskBoardMenu";
import NewTaskModal from "./NewTaskModal";
import useActiveTaskBoard from "../zustand/store";

type Status = "authenticated" | "loading" | "unauthenticated";

const MenuBar = ({ onEdit }: { onEdit: () => void }) => {
  const { status, data: session } = useSession();
  const { activeBoard } = useActiveTaskBoard();
  return (
    <div className=" max-w-[100vw] grow flex justify-between items-center px-2 md:px-6 min-h-[4rem]  md:min-h-[5rem] lg:h-[6rem] border-b-[1px] border-zinc-600">
      <div className="flex items-center gap-1">
        {status === "loading" ? (
          <div className="skeleton w-[100px] h-10"></div>
        ) : (
          <>
            <MenuDropDown />
            <h2 className="md:text-xl font-bold text-white">
              {activeBoard ? activeBoard.title : "No Active Board"}
            </h2>
          </>
        )}
      </div>
      {status === "loading" ? (
        <div className="skeleton w-[140px] h-10"></div>
      ) : (
        <NewTaskModal onEdit={onEdit} />
      )}

      <AuthStatus />
    </div>
  );
};

const MenuDropDown = () => {
  return (
    <div className=" md:hidden dropdown dropdown-bottom">
      <div tabIndex={0} role="button">
        <RiArrowDropDownLine size="30" />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] w-[18rem] p-2 shadow bg-neutral rounded-lg"
      >
        <TaskBoardMenu />
      </div>
    </div>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <div className=" rounded-full skeleton w-[40px] h-10"></div>;
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/api/auth/signin" className="btn btn-primary">
        Login
      </Link>
    );
  }

  return (
    <div className="h-10">
      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img referrerPolicy="no-referrer" src={session?.user?.image!} />
            </div>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
        >
          <li className="p-1">{session?.user?.email}</li>
          <li className="bg-secondary text-white rounded-lg">
            <Link href="/api/auth/signout">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuBar;
