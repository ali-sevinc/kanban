import Board from "@/components/Board";
import fs from "fs";
import path from "path";

type TaskType = {
  id: string;
  type: string;
  progress: "todo" | "doing" | "done";
  body: string;
};

export default function BoardPage({ params }: { params: { board: string } }) {
  const filePath = path.join(process.cwd(), "datas.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData).tasks as TaskType[];
  const filteredData = data.filter((item) => item.type === params.board);

  return <Board tasks={filteredData} />;
}
