import Board from "@/components/Board";
import { getBoards, getTasks } from "@/lib/fncs";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function BoardPage({
  params,
}: {
  params: { board: string };
}) {
  const { boards } = await getBoards();
  const board = boards?.find((board) => board.slug === params.board)!;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(board?.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Board slug={params.board} />
    </HydrationBoundary>
  );
}
