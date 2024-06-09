import db from "./db";
import { ProgressType } from "./types";

export function getTasksByBoardId(board_id: string) {
  const res = db
    .prepare("SELECT * FROM tasks WHERE board_id = ?")
    .all(board_id);
  return res;
}

type NewTaskType = {
  board_id: string;
  body: string;
  progress: ProgressType;
  title: string;
};
export function newTask({ board_id, body, progress, title }: NewTaskType) {
  const res = db
    .prepare(
      "INSERT INTO tasks (title, body, progress, board_id) VALUES (?, ?, ?, ?)"
    )
    .run(title, body, progress, board_id);
  return res;
}

export function updateTaskById({
  id,
  progress,
}: {
  id: number;
  progress: ProgressType;
}) {
  const res = db
    .prepare("UPDATE tasks SET progress = ? WHERE id = ?")
    .run(progress, id);

  return res;
}

export function deleteTaskById(id: number) {
  const res = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  return res;
}
