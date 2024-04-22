"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import TaskBoardMenu from "./TaskBoardMenu";

const MenuBar = () => {
  return (
    <div className="grow md:border-l-[1px] border-zinc-600 flex justify-between items-center px-2">
      <div className="flex items-center gap-1">
        <MenuDropDown />
        <h2>BoardName</h2>
      </div>
      <div>ADD TASK, !MenuIcon</div>
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
