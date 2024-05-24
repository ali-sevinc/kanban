"use client";

import { useState } from "react";

import { ProgressType, TaskType } from "@/lib/types";

import BoardItems from "./BoardItems";
import { deleteTodo, fetchBoards, updateTaskProgress } from "@/lib/fncs";
import { useQuery } from "@tanstack/react-query";

type PropsType = { tasks: TaskType[]; boardId: string; slug: string };

export default function Board({ tasks, boardId, slug }: PropsType) {
  const { data, error, isFetched } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchBoards(slug),
  });
  console.log(data);
  const [taskItems, setTaskItems] = useState(tasks);
  const [draggedItem, setDraggedItem] = useState<TaskType | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const todo = taskItems.filter((item) => item.progress === "todo");
  const doing = taskItems.filter((item) => item.progress === "doing");
  const done = taskItems.filter((item) => item.progress === "done");

  async function handleChangeTaskProgress(
    progress: "todo" | "doing" | "done",
    taskId: string
  ) {
    setIsLoading(true);
    setTaskItems((prev) =>
      prev.map((item) =>
        item.id === taskId ? { ...item, progress: progress } : item
      )
    );
    try {
      await updateTaskProgress(boardId, taskId, progress);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    // setTaskItems(data);
  }

  function handleStartDrag(task: TaskType) {
    // console.log(task.id, "start dragged");
    setDraggedItem(task);
  }

  function handleDropped(progress: ProgressType) {
    if (!draggedItem) return;
    if (draggedItem.progress === progress) return;
    handleChangeTaskProgress(progress, draggedItem.id);
  }

  async function handleDelete(id: string) {
    try {
      const res = await deleteTodo(boardId, id);
      setTaskItems((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-w-[72rem] overflow-x-scroll grid grid-cols-3 divide-x-2 min-h-screen">
      <BoardItems
        title="TODO"
        task={todo}
        onStartDrag={handleStartDrag}
        onDrop={() => handleDropped("todo")}
        isChanging={isLoading}
        onDelete={handleDelete}
      />
      <BoardItems
        title="DOING"
        task={doing}
        onStartDrag={handleStartDrag}
        onDrop={() => handleDropped("doing")}
        isChanging={isLoading}
        onDelete={handleDelete}
      />
      <BoardItems
        title="DONE"
        task={done}
        onStartDrag={handleStartDrag}
        onDrop={() => handleDropped("done")}
        isChanging={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
}
