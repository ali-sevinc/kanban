"use client";

import { useState } from "react";

import { BoardType, ProgressType, TaskType, UserType } from "@/lib/types";

import BoardItems from "./BoardItems";
import { deleteTodo, getBoardByUserId, getTasks, updateTask } from "@/lib/fncs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "@/context/user-context";
import { redirect } from "next/navigation";

type PropsType = { slug: string; user: UserType };

export default function Board({ slug, user }: PropsType) {
  const [draggedItem, setDraggedItem] = useState<TaskType | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const queryCliet = useQueryClient();

  const { data: fetchedBoards } = useQuery({
    queryKey: ["boards"],
    queryFn: () => getBoardByUserId(user.user?.id || ""),
  });
  let boards: BoardType[] = [];
  if (fetchedBoards) {
    boards = fetchedBoards.boards;
  }

  const boardId = boards?.find((board) => board.slug === slug)?.id!;

  const { data: fetchedTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(boardId),
  });
  let taskItems: TaskType[] = [];
  if (fetchedTasks) {
    taskItems = fetchedTasks.tasks;
  }

  const { mutate: deleteMutation } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteTodo(id),
    onSettled: () => {
      queryCliet.invalidateQueries({ queryKey: ["tasks"] });
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
    setIsLoading(true);
    if (!boardId) return;
    try {
      await updateTask(taskId, progress);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
    if (!boardId) return;
    try {
      deleteMutation({ id });
    } catch (error) {
      console.error(error);
    }
  }

  // if (!user) redirect("/auth/login");

  return (
    <ul className="min-w-[72rem] overflow-x-scroll grid grid-cols-3 divide-x-2 min-h-screen">
      {tasks.map((task) => (
        <BoardItems
          key={task.title}
          title={task.title}
          task={task.task}
          onStartDrag={handleStartDrag}
          onDrop={() => handleDropped(task.title)}
          isChanging={isLoading}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
