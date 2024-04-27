import { TaskBoard } from "@prisma/client";
import { create } from "zustand";
import useTaskBoards from "../hooks/useTaskBoards";

interface ActiveTaskBoardStore {
  activeBoard: TaskBoard | null;
  DefaultBoard: (taskBoards: TaskBoard[]) => void;
  setIsActive: (board: TaskBoard) => void;
}

const useActiveTaskBorad = create<ActiveTaskBoardStore>((set) => ({
  activeBoard: null,
  DefaultBoard: (taskBoards: TaskBoard[]) => {
    if (taskBoards && taskBoards.length > 0) {
      set({ activeBoard: taskBoards[0] });
    }
  },
  setIsActive: (board: TaskBoard) => {
    set({ activeBoard: board });
  },
}));

export default useActiveTaskBorad;
