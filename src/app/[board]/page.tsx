import Board from "@/components/Board";
import { fetchBoards } from "@/lib/fncs";

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Board slug={`/${params.board}`} />
    </HydrationBoundary>
  );
}
