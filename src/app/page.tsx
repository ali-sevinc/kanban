import Board from "@/components/Board";
import { fetchBoards } from "@/lib/fncs";
import { BoardType } from "@/lib/types";

export default async function Home() {
  const fetchedTasks = (await fetchBoards()) as BoardType[];
  const tasks = fetchedTasks
    .filter((board) => board.tasks)
    .flatMap((tasks) => tasks.tasks);

  return <Board tasks={tasks} />;
}
