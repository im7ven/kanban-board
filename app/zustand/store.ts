import { TaskBoard } from "@prisma/client";
import { create } from "zustand";

interface ActiveTaskBoardStore {
  activeBoard: TaskBoard | null;
  defaultBoard: (taskBoards: TaskBoard[] | null) => void;
  setIsActive: (board: TaskBoard | null) => void;
}

const useActiveTaskBorad = create<ActiveTaskBoardStore>((set) => ({
  activeBoard: null,
  defaultBoard: (taskBoards: TaskBoard[] | null) => {
    if (taskBoards && taskBoards.length > 0) {
      set({ activeBoard: taskBoards[0] });
    } else {
      set({ activeBoard: null });
    }
  },
  setIsActive: (board: TaskBoard | null) => {
    set({ activeBoard: board });
  },
}));

export default useActiveTaskBorad;
