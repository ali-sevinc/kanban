import { ArchiveType } from "@/lib/types";
import ArchiveItem from "./ArchiveItem";

export default function Archive({ archive }: { archive: ArchiveType[] }) {
  return (
    <>
      {archive.length > 0 ? (
        <ul className="divide-y flex flex-col gap-1">
          {archive.map((item) => (
            <ArchiveItem
              key={item.id}
              board_name={item.board_name}
              body={item.body}
              progress={item.progress}
              title={item.title}
              id={item.id}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-xl py-4">There is no task in archive.</p>
      )}
    </>
  );
}
