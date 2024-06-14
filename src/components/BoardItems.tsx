import { motion } from "framer-motion";
import { TaskType } from "@/lib/types";
import { HiArchive, HiDotsHorizontal, HiTrash, HiX } from "react-icons/hi";
import MenuProvider from "./Menu";

type PropsType = {
  task: TaskType[];
  title: string;
  onStartDrag: (item: TaskType) => void;
  onDrop: () => void;
  isChanging: boolean;
  onDelete: (id: number) => void;
};
export default function BoardItems({
  task,
  title,
  onStartDrag,
  onDrop,
  isChanging,
  onDelete,
}: PropsType) {
  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    onDrop();
  }
  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  return (
    <li onDrop={handleDrop} onDragOver={handleDragOver} className="px-4">
      <h2 className="text-center text-xl font-semibold pb-4 uppercase">
        {title}
      </h2>
      {task?.length > 0 ? (
        <motion.ol className="flex flex-col gap-2">
          {task.map((item) => {
            let progressStyle = "";
            if (item.progress === "todo") progressStyle = "bg-zinc-400";
            if (item.progress === "doing") progressStyle = "bg-blue-400";
            if (item.progress === "done") progressStyle = "bg-green-400";

            return (
              <motion.li
                layout
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                draggable={!isChanging}
                onDragStart={() => onStartDrag(item)}
                key={item.id}
                className="bg-zinc-700 rounded-xl relative px-4 py-2 mx-4 h-32 cursor-pointer flex flex-col justify-between"
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p>{item.body}</p>
                <div className="text-end">
                  <span
                    className={` text-zinc-900 w-20 text-center uppercase text-xs font-semibold inline-block px-2 py-1 rounded-xl ${progressStyle}`}
                  >
                    {item.progress}
                  </span>
                </div>
                <div className="absolute top-2 right-4">
                  <MenuProvider>
                    <MenuProvider.Toggle openName={item.id.toString()}>
                      <HiDotsHorizontal className="text-xl hover:bg-zinc-800 px-1 duration-200" />
                    </MenuProvider.Toggle>
                    <MenuProvider.List openName={item.id.toString()}>
                      <MenuProvider.Item>
                        <HiArchive />
                      </MenuProvider.Item>
                      <MenuProvider.Item onClick={() => onDelete(item.id)}>
                        <HiTrash />
                      </MenuProvider.Item>
                    </MenuProvider.List>
                  </MenuProvider>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      ) : (
        <p>No item found.</p>
      )}
    </li>
  );
}
