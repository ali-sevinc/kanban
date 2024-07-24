"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import slugify from "slugify";

import { BoardType, UserType, UserVerifyType } from "@/lib/types";
import { createBoard } from "@/lib/actions";

import TextButton from "./TextButton";
import InputGroup from "./InputGroup";
import Button from "./Button";
import Modal from "./Modal";

export default function NewBoard({
  boards,
  user,
}: {
  boards: BoardType[];
  user: UserType;
}) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, slug }: { title: string; slug: string }) =>
      createBoard({ title, slug }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const [title, setTitle] = useState("");

  const [error, setError] = useState("");

  console.log(user);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (
      title.trim().length < 3 ||
      title.toLocaleLowerCase() === "boards" ||
      title.toLocaleLowerCase() === "archive" ||
      title.toLocaleLowerCase() === "profile"
    ) {
      setError("Please enter a valid board name.");
      return;
    }

    if (!user?.id) return;

    const slug = slugify(title, { lower: true });

    const existedSlug = boards?.find((item) => item.slug === slug);
    if (existedSlug) {
      setError("Existed board!! Please try something else.");
      return;
    }

    mutate({ title, slug });

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

      <AnimatePresence mode="wait">
        {showForm && (
          <Modal open={showForm} onClose={handleCloseForm}>
            <form onSubmit={handleSubmit} className="text-zinc-50">
              <h2 className="text-2xl text-center font-semibold pb-4">
                Create New Board
              </h2>

              <InputGroup
                id="board-name"
                label="Board Name"
                onChange={(e) => setTitle(e)}
              />
              {error !== "" && (
                <p className="text-sm text-red-500 pt-1 text-center">{error}</p>
              )}
              <div className="flex items-end justify-center gap-4 pt-8 pb-4">
                <Button
                  model="secondary"
                  type="button"
                  onClick={handleCloseForm}
                >
                  Close
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
