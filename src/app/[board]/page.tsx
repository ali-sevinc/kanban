import Board from "@/components/Board";
import { fetchBoards } from "@/lib/fncs";
import { BoardType, TaskType } from "@/lib/types";

export default async function BoardPage({
  params,
}: {
  params: { board: string };
}) {
  let tasks;
  const fetchedBoard = (await fetchBoards(`/${params.board}`)) as BoardType[];

  tasks = fetchedBoard[0].tasks;

  if (!tasks?.length || !tasks) tasks = [] as TaskType[];

  return <Board tasks={tasks} />;
}
