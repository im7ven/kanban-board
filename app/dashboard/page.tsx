"use client";

import { useState } from "react";
import MenuBar from "../components/MenuBar";
import UserContent from "../components/UserContent";

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <div className="h-[4rem] flex md:h-[5rem] lg:h-[6rem] border-b-[1px] border-zinc-600 ">
        <h1 className="md:w-[17rem] lg:w-[19rem] hidden md:block">LOGO</h1>
        <MenuBar />
      </div>
      <UserContent />
    </main>
  );
}
