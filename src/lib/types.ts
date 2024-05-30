export type ProgressType = "todo" | "doing" | "done";
export type TaskType = {
  id: number;
  progress: ProgressType;
  body: string;
  title: string;
  boardId: number;
};
export type BoardType = {
  boardId: string;
  title: string;
  slug: string;
  id: number;
  userId: string;
  tasks: TaskType[];
};
