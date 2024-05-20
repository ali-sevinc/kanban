import Board from "@/components/Board";
import { fetchTasks } from "@/lib/fncs";
import { TaskType } from "@/lib/types";

export default async function BoardPage({
  params,
}: {
  params: { board: string };
}) {
  // const { tasks } = fetchData() as { tasks: TaskType[] };
  const tasks = (await fetchTasks()) as TaskType[];

  const filteredData = tasks.filter((item) => item.type === params.board);

  return <Board tasks={filteredData} />;
}
