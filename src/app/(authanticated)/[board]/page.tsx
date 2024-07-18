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
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Board slug={params.board} />
    </HydrationBoundary>
  );
}
