export type ProgressType = "todo" | "doing" | "done";
export type TaskType = {
  id: string;
  type: string;
  progress: ProgressType;
  body: string;
  title: string;
};
export type BoardType = {
  boardId: string;
  title: string;
  slug: string;
  id: string;
  tasks: TaskType[];
};
