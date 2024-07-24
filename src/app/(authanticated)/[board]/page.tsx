import Board from "@/components/Board";
import { createClient } from "@/utils/supabase/server";

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
  const queryClient = new QueryClient();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Board slug={params.board} user={user} />
    </HydrationBoundary>
  );
}
