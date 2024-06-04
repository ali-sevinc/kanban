"use client";

type PropsType = {
  onChange: (e: string) => void;
  label: string;
  id: string;
  type?: "text" | "email" | "password";
};
export default function InputGroup({
  onChange,
  label,
  id,
  type = "text",
}: PropsType) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-lg">
        {label}
      </label>
      <input
        onChange={(e) => onChange(e.target.value)}
        type="text"
        id={id}
        required
        className="text-zinc-900 text-xl px-2 w-72 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded"
      />
    </div>
  );
}
