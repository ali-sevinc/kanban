"use client";

import { useState } from "react";

import { ProgressType, TaskType } from "@/lib/types";

import BoardItems from "./BoardItems";
import { deleteTodo, fetchBoards, updateTaskProgress } from "@/lib/fncs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type PropsType = { slug: string };

export default function Board({ slug }: PropsType) {
  const queryCliet = useQueryClient();

  const { data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchBoards(slug),
  });

  const { mutate: deleteMutation } = useMutation({
    mutationFn: ({ boardId, id }: { boardId: string; id: string }) =>
      deleteTodo(boardId, id),
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
      taskId: string;
    }) => handleChangeTaskProgress(progress, taskId),
    onSettled: () => {
      queryCliet.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const taskItems = data?.[0]?.tasks as TaskType[];
  const boardId = data?.[0].id;
  const [draggedItem, setDraggedItem] = useState<TaskType | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const tasks: { title: "todo" | "doing" | "done"; task: TaskType[] }[] = [
    {
      title: "todo",
      task: taskItems?.filter((item) => item.progress === "todo"),
    },
    {
      title: "doing",
      task: taskItems?.filter((item) => item.progress === "doing"),
    },
    {
      title: "done",
      task: taskItems?.filter((item) => item.progress === "done"),
    },
  ];

  async function handleChangeTaskProgress(
    progress: "todo" | "doing" | "done",
    taskId: string
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

  async function handleDelete(id: string) {
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
