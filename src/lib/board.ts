import db from "./db";

export function createNewBoard({
  title,
  slug,
  user_id,
}: {
  title: string;
  slug: string;
  user_id: string;
}) {
  const res = db
    .prepare("INSERT INTO boards (title, slug, user_id) VALUES (?, ?, ?)")
    .run(title, slug, user_id);

  console.log("inside of board.ts", res);
  return res;
}

export function getBoards(id: string) {
  const res = db.prepare("SELECT * FROM boards WHERE user_id = ?").all(id);
  return res;
}

export function deleteBoardById(id: number) {
  const res = db.prepare("DELETE FROM boards WHERE id = ?").run(id);
  return res;
}
