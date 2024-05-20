import Board from "@/components/Board";
import { fetchTasks } from "@/lib/fncs";
import { TaskType } from "@/lib/types";

export default async function Home() {
  // const { tasks } = fetchData() as { tasks: TaskType[] };
  const tasks = (await fetchTasks()) as TaskType[];

  return <Board tasks={tasks} />;
}
