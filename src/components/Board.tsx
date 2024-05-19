"use client";

import { useState } from "react";

import { ProgressType, TaskType } from "@/lib/types";

import BoardItems from "./BoardItems";

export default function Board({ tasks }: { tasks: TaskType[] }) {
  const [taskItems, setTaskItems] = useState(tasks);
  const [draggedItem, setDraggedItem] = useState<TaskType | null>(null);

  const todo = taskItems.filter((item) => item.progress === "todo");
  const doing = taskItems.filter((item) => item.progress === "doing");
  const done = taskItems.filter((item) => item.progress === "done");

  function handleChangeTasksProgress(
    progress: "todo" | "doing" | "done",
    taskId: string
  ) {
    setTaskItems((prev) =>
      prev.map((item) =>
        item.id === taskId ? { ...item, progress: progress } : item
      )
    );
  }

  function handleStartDrag(task: TaskType) {
    // console.log(task.id, "start dragged");
    setDraggedItem(task);
  }

  function handleDropped(progress: ProgressType) {
    if (!draggedItem) return;
    if (draggedItem.progress === progress) return;
    handleChangeTasksProgress(progress, draggedItem.id);
  }

  return (
    <div className="min-w-[72rem] overflow-x-scroll grid grid-cols-3 divide-x-2 min-h-screen">
      <BoardItems
        title="TODO"
        task={todo}
        onStartDrag={handleStartDrag}
        onDrop={() => handleDropped("todo")}
      />
      <BoardItems
        title="DOING"
        task={doing}
        onStartDrag={handleStartDrag}
        onDrop={() => handleDropped("doing")}
      />
      <BoardItems
        title="DONE"
        task={done}
        onStartDrag={handleStartDrag}
        onDrop={() => handleDropped("done")}
      />
    </div>
  );
}
