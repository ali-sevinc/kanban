import Board from "@/components/Board";
import { TaskType } from "@/lib/types";
import fs from "fs";
import path from "path";

export function fetchData() {
  const filePath = path.join(process.cwd(), "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData).tasks as TaskType[];
  return data;
}

export default function BoardPage({ params }: { params: { board: string } }) {
  const data = fetchData();
  const filteredData = data.filter((item) => item.type === params.board);

  return <Board tasks={filteredData} />;
}
