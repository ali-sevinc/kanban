import Board from "@/components/Board";
import { verifyAuth } from "@/lib/auth";
import { getBoardByUserId, getTasks } from "@/lib/actions";
import { BoardType } from "@/lib/types";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function BoardPage({
  params,
}: {
  params: { board: string };
}) {
  const user = await verifyAuth();
  if (!user.user || !user.session) {
    return redirect("/auth/login");
  }

  const boards = (await getBoardByUserId(user.user.id)) as BoardType[];
  const board = boards?.find((board) => board.slug === params.board)!;

  // console.log("BOARD PAGE", board);
  const taskItems = await getTasks(board?.id.toString());

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(board?.id.toString()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Board slug={params.board} user={user} taskItems={taskItems} />
    </HydrationBoundary>
  );
}
