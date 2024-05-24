import Board from "@/components/Board";
import { fetchBoards } from "@/lib/fncs";
import { BoardType, TaskType } from "@/lib/types";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const revalidate = 1;

export default async function BoardPage({
  params,
}: {
  params: { board: string };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchBoards(`/${params.board}`),
  });

  let tasks;
  const fetchedBoard = (await fetchBoards(`/${params.board}`)) as BoardType[];

  tasks = fetchedBoard[0].tasks;

  if (!tasks?.length || !tasks) tasks = [] as TaskType[];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Board
        slug={`/${params.board}`}
        tasks={tasks}
        boardId={fetchedBoard[0].id}
      />
    </HydrationBoundary>
  );
}
