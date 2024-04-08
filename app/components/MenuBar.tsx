"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import TaskBoardMenu from "./TaskBoardMenu";

const MenuBar = () => {
  return (
    <div className="grow md:border-l-[1px] border-zinc-600 flex justify-between items-center px-5">
      <div className="flex items-center gap-1">
        <h2>BoardName</h2>
        <MenuDropDown />
      </div>
      <div>ADD TASK, !MenuIcon</div>
      <AuthStatus />
    </div>
  );
};

const MenuDropDown = () => {
  const dropDownModal = useRef<HTMLDialogElement>(null);

  return (
    <div className="md:hidden">
      <RiArrowDropDownLine
        onClick={() => dropDownModal.current?.showModal()}
        size="30"
      />
      <dialog ref={dropDownModal} id="menuDropDown" className="modal">
        <div className="modal-box max-w-[20rem]">
          <TaskBoardMenu />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return null;

  if (status === "unauthenticated")
    return (
      <button className="btn btn-accent text-white">
        <Link href="/api/auth/signin">Login</Link>
      </button>
    );

  return (
    <div className="h-10">
      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button">
          <div className="avatar">
            <div className="w-10 rounded-full">
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
