import db from "./db";

type AddType = {
  title: string;
  body: string;
  progress: string;
  board_name: string;
  user_id: string;
};
export function addToArchive({
  title,
  body,
  progress,
  board_name,
  user_id,
}: AddType) {
  const res = db
    .prepare(
      "INSERT INTO archive (title, body, progress, board_name, user_id) VALUES (?, ?, ?, ?, ?)"
    )
    .run(title, body, progress, board_name, user_id);

  return res;
}

export function getArchiveByUserId(user_id: string) {
  const res = db
    .prepare("SELECT * FROM archive WHERE user_id = ?")
    .all(user_id);
  return res;
}

export function deleteArchiveById(id: number) {
  db.prepare("DELETE FROM archive WHERE id = ?").run(id);
}
