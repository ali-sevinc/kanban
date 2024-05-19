import { TaskType } from "@/lib/types";

type PropsType = {
  task: TaskType[];
  title: string;
  onStartDrag: (item: TaskType) => void;
  onDrop: () => void;
};
export default function BoardItems({
  task,
  title,
  onStartDrag,
  onDrop,
}: PropsType) {
  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    onDrop();
  }
  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} className="px-4">
      <h2 className="text-center text-xl font-semibold pb-4">{title}</h2>
      {task.length > 0 ? (
        <ol className="flex flex-col gap-2">
          {task.map((item) => {
            let progressStyle = "";
            if (item.progress === "todo") progressStyle = "bg-zinc-400";
            if (item.progress === "doing") progressStyle = "bg-blue-400";
            if (item.progress === "done") progressStyle = "bg-green-400";

            return (
              <li
                draggable
                onDragStart={() => onStartDrag(item)}
                key={item.id}
                className="bg-zinc-700 rounded-xl px-4 py-2 mx-4 h-32 cursor-pointer flex flex-col justify-between"
              >
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p>{item.body}</p>
                <div className="text-end">
                  <span
                    className={` text-zinc-900 w-20 text-center uppercase text-xs font-semibold inline-block px-2 py-1 rounded-xl ${progressStyle}`}
                  >
                    {item.progress}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p>No item found.</p>
      )}
    </div>
  );
}
