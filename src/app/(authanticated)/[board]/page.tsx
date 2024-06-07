import Board from "@/components/Board";
import { verifyAuth } from "@/lib/auth";
import { getBoards, getTasks } from "@/lib/fncs";

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
  const res = await verifyAuth();
  if (!res.user || !res.session) {
    return redirect("/auth/login");
  }

  console.log("[USER FROM PAGE!]", res);

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
