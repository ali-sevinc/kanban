"use client";

import { useState } from "react";

import { BoardType, ProgressType, TaskType } from "@/lib/types";

import BoardItems from "./BoardItems";
import {
  createArchive,
  deleteTask,
  getBoardByUserId,
  getTasks,
  updateTask,
} from "@/lib/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";

type PropsType = { slug: string; user: User | null };

export default function Board({ slug, user }: PropsType) {
  const [draggedItem, setDraggedItem] = useState<TaskType | null>(null);

  const [isChanging, setIsChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryCliet = useQueryClient();

  const { data: fetchedBoards } = useQuery({
    queryKey: ["boards"],
    queryFn: () => getBoardByUserId(),
  });
  let boards: BoardType[] = [];
  if (fetchedBoards) {
    boards = fetchedBoards;
  }

  const board = boards?.find((board) => board.slug === slug);
  const boardId = board?.id!;

  const { data: taskItems } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      setIsLoading(true);
      const res = await getTasks(boardId);
      setIsLoading(false);
      return res;
    },
  });

  const { mutate: updateMutation } = useMutation({
    mutationFn: ({
      progress,
      taskId,
    }: {
      progress: "todo" | "doing" | "done";
      taskId: number;
    }) => handleChangeTaskProgress(progress, taskId),
    onSettled: () => {
      queryCliet.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const tasks: { title: "todo" | "doing" | "done"; task: TaskType[] }[] = [
    {
      title: "todo",
      task: taskItems?.filter((item) => item.progress === "todo") || [],
    },
    {
      title: "doing",
      task: taskItems?.filter((item) => item.progress === "doing") || [],
    },
    {
      title: "done",
      task: taskItems?.filter((item) => item.progress === "done") || [],
    },
  ];

  async function handleChangeTaskProgress(
    progress: "todo" | "doing" | "done",
    taskId: number
  ) {
    setIsChanging(true);
    if (!boardId) return;
    try {
      await updateTask(taskId, progress);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChanging(false);
    }
  }

  function handleStartDrag(task: TaskType) {
    setDraggedItem(task);
  }

  function handleDropped(progress: ProgressType) {
    if (!draggedItem) return;
    if (draggedItem.progress === progress) return;
    updateMutation({ progress, taskId: draggedItem.id! });
  }

  async function handleDelete(id: number) {
    if (!boardId || !id) return;

    try {
      await deleteTask(id);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddArchive({
    id,
    title,
    body,
    progress,
  }: {
    id: number;
    title: string;
    body: string;
    progress: ProgressType;
  }) {
    const board_name = board?.title;
    const user_id = user?.id;
    if (!board_name || !user_id) return;
    const data = { title, body, progress, board_name, user_id };
    const res = await createArchive(data);

    await deleteTask(id);
    queryCliet.invalidateQueries({ queryKey: ["tasks"] });
  }

  return (
    <ul className="min-w-[72rem] overflow-x-scroll grid grid-cols-3 divide-x-2 min-h-screen">
      {tasks.map((task) => (
        <BoardItems
          key={task.title}
          title={task.title}
          task={task.task}
          onStartDrag={handleStartDrag}
          onDrop={() => handleDropped(task.title)}
          isChanging={isChanging}
          onDelete={handleDelete}
          onArchive={handleAddArchive}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}
