import { ArchiveType } from "@/lib/types";

const progress = {
  todo: "bg-zinc-400",
  doing: "bg-blue-400",
  done: "bg-green-400",
};

export default function Archive({ archive }: { archive: ArchiveType[] }) {
  console.log(archive);
  return (
    <ul className="divide-y">
      {archive.length > 0 &&
        archive.map((item) => (
          <li key={item.id} className="">
            <h2>{item.board_name}</h2>
            <p>{item.title}</p>
            <p>{item.body}</p>
            <span className={`${progress[item.progress]}`}>
              {item.progress}
            </span>
          </li>
        ))}
    </ul>
  );
}
