"use client";

import { FormEvent, useState } from "react";
import InputGroup from "./InputGroup";
import Button from "./Button";
import { addTodo } from "@/lib/fncs";
import { BoardType } from "@/lib/types";

type PropsType = {
  board: BoardType;
  onClose: () => void;
};

export default function NewTodo({ board, onClose }: PropsType) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (title.trim().length < 3 || body.trim().length < 3 || !board.id) {
      return;
    }

    const data = {
      progress: "todo",
      title,
      body,
      id: Math.random().toString(),
    };

    const resData = await addTodo(board, data);

    console.log(resData);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-zinc-50">
      <h2 className="text-xl text-center pt-2">New Todo</h2>

      <InputGroup id="title" label="Title" onChange={(e) => setTitle(e)} />

      <InputGroup id="todo" label="Todo" onChange={(e) => setBody(e)} />
      <div className="flex items-center justify-center gap-4">
        <Button onClick={onClose} model="secondary">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
