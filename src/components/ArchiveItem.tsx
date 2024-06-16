import { deleteArchive } from "@/lib/actions";
import { HiX } from "react-icons/hi";

const progressStyle = {
  todo: "bg-zinc-400",
  doing: "bg-blue-400",
  done: "bg-green-400",
};

type PropsType = {
  board_name: string;
  title: string;
  body: string;
  progress: "todo" | "doing" | "done";
  id: number;
};
export default function ArchiveItem({
  board_name,
  title,
  body,
  progress,
  id,
}: PropsType) {
  async function archvieAction(formData: FormData) {
    "use server";
    const archiveId = formData.get("archiveId") as string;
    if (!archiveId) return;
    await deleteArchive(+archiveId);
  }

  return (
    <li className="relative">
      <p>
        <span className="italic">Board Name: </span>{" "}
        <span className="uppercase text-lg">{board_name} </span>
      </p>
      <p>
        <span className="italic">Title: </span>{" "}
        <span className="text-lg">{title}</span>
      </p>
      <p>
        <span className="italic">Body: </span>{" "}
        <span className="text-lg">{body}</span>
      </p>
      <p>
        <span className="italic">Progress: </span>{" "}
        <span className={`${progressStyle[progress]} px-1 rounded text-lg`}>
          {progress}
        </span>
      </p>
      <form action={archvieAction} className="absolute right-1 top-1 text-2xl">
        <input defaultValue={id} name="archiveId" hidden />
        <button className="hover:text-red-500">
          <HiX />
        </button>
      </form>
    </li>
  );
}
