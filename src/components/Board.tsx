"use client";

import { useState } from "react";

import { BoardType, ProgressType, TaskType } from "@/lib/types";

import BoardItems from "./BoardItems";
import {
  deleteTodo,
  getBoards,
  getTasks,
  updateTaskProgress,
} from "@/lib/fncs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type PropsType = { slug: string };

export default function Board({ slug }: PropsType) {
  const [draggedItem, setDraggedItem] = useState<TaskType | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const queryCliet = useQueryClient();

  const { data: fetchedBoards } = useQuery({
    queryKey: ["boards"],
    queryFn: () => getBoards(),
  });
  let boards: BoardType[] = [];
  if (fetchedBoards) {
    boards = fetchedBoards.boards;
  }
  console.log(fetchedBoards);

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
    mutationFn: ({ boardId, id }: { boardId: number; id: number }) =>
      deleteTodo(boardId, id),
    onSettled: () => {
      queryCliet.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  console.log(taskItems);

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

  // const taskItems = data?.[0]?.tasks as TaskType[];

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
      await updateTaskProgress(boardId, taskId, progress);
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
    updateMutation({ progress, taskId: draggedItem.id });
  }

  async function handleDelete(id: number) {
    if (!boardId) return;
    try {
      deleteMutation({ boardId, id });
    } catch (error) {
      console.error(error);
    }
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
          isChanging={isLoading}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
