type TaskType = {
  id: string;
  type: string;
  progress: "todo" | "doing" | "done";
  body: string;
};
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
          {task.map((item) => (
            <li
              draggable
              onDragStart={() => onStartDrag(item)}
              key={item.id}
              className="bg-zinc-700 rounded-xl px-4 py-2 mx-4 h-32 cursor-pointer"
            >
              <p>{item.body}</p>
              <p>{item.progress}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p>No item found.</p>
      )}
    </div>
  );
}
