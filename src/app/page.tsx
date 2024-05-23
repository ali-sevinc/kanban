import Home from "@/components/Home";
// import { fetchBoards } from "@/lib/fncs";
// import { BoardType } from "@/lib/types";

export default async function HomePage() {
  // const fetchedTasks = (await fetchBoards()) as BoardType[];
  // const tasks = fetchedTasks
  //   .filter((board) => board.tasks)
  //   .flatMap((tasks) => tasks.tasks);

  // return <Board tasks={tasks} />;
  return <Home />;
}
