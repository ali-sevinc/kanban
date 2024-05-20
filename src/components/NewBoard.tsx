"use client";

import { FormEvent, useState } from "react";
import TextButton from "./TextButton";
import Modal from "./Modal";
import { BoardType } from "@/lib/types";
import slugify from "slugify";
import { createBoard } from "@/lib/fncs";
import Button from "./Button";

export default function NewBoard({ boards }: { boards: BoardType[] }) {
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("Please enter a valid board name.");
      return;
    }

    const slug = `/${slugify(title, { lower: true })}`;
    const existedSlug = boards.find((item) => item.slug === slug);
    if (existedSlug) {
      setError("Existed board!! Please try something else.");
      return;
    }

    const res = await createBoard({ title, slug });
    console.log(res);

    setShowForm(false);
  }

  function handleCloseForm() {
    setError("");
    setTitle("");
    setShowForm(false);
  }

  return (
    <>
      <TextButton onClick={() => setShowForm(true)}>
        +Create New Board
      </TextButton>
      {showForm && (
        <Modal open={showForm} onClose={handleCloseForm}>
          <form onSubmit={handleSubmit} className="text-zinc-50">
            <h2 className="text-2xl text-center font-semibold pb-4">
              Create New Board
            </h2>
            <div className="flex flex-col">
              <label htmlFor="board-name" className="text-lg">
                Board Name
              </label>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                id="board-name"
                required
                className="text-zinc-900 text-xl px-2 w-72 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded"
              />
            </div>
            {error !== "" && (
              <p className="text-sm text-red-500 pt-1 text-center">{error}</p>
            )}
            <div className="flex items-end justify-center gap-4 pt-8 pb-4">
              <Button model="secondary" type="button" onClick={handleCloseForm}>
                Close
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
