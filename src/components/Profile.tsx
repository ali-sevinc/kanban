"use client";

import { useState } from "react";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";
import { useFormState, useFormStatus } from "react-dom";
import Button from "./Button";
import { UserType } from "@/lib/types";

type PropsType = {
  updateImage: (
    prevState: {},
    formData: FormData
  ) => Promise<{ error?: string }>;
  updateName: (
    prevState: {},
    formData: FormData
  ) => Promise<{ error?: string }>;
  updatePassword: (
    prevState: {},
    formData: FormData
  ) => Promise<{ currentError?: string; newError?: string }>;
  user: UserType | undefined;
};
export default function Profile({
  updateImage,
  updateName,
  updatePassword,
  user,
}: PropsType) {
  const [showImageForm, setShowImageForm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  async function handleImage(prevState: {}, formData: FormData) {
    const data = await updateImage(prevState, formData);
    if (!data?.error) {
      setShowImageForm(false);
    }
    return data;
  }
  async function handleName(prevState: {}, formData: FormData) {
    const data = await updateName(prevState, formData);
    if (!data?.error) {
      setShowNameForm(false);
    }
    return data;
  }
  async function handlePassword(prevState: {}, formData: FormData) {
    const data = await updatePassword(prevState, formData);
    if (!data?.currentError && !data?.newError) {
      setShowPasswordForm(false);
    }
    return data;
  }

  const [imageState, imageAction] = useFormState(handleImage, {});
  const [nameState, nameAction] = useFormState(handleName, {});
  const [passwordState, passwordAction] = useFormState(handlePassword, {});

  return (
    <>
      <div className="flex flex-col divide-y-2 gap-4 w-72 mx-auto  items-center">
        <button
          onClick={() => setShowImageForm(true)}
          className="w-44 h-44 rounded-full"
        >
          <img
            src={user?.image}
            className="rounded-full object-cover w-full h-full"
            alt={`${user?.name} profile picture.`}
          />
        </button>

        <div className="flex items-center justify-between w-full">
          <p>{user?.name}</p>
          <button onClick={() => setShowNameForm(true)}>Change Name</button>
        </div>
        <div className="w-full text-center flex items-center justify-between">
          <p>*********</p>
          <button onClick={() => setShowPasswordForm(true)}>
            Change Password
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {showImageForm && (
          <Modal open={showImageForm} onClose={() => setShowImageForm(false)}>
            <form action={imageAction}>
              <h2 className="text-zinc-50 text-center text-xl py-2">
                Change Image
              </h2>
              <div className="flex text-zinc-50 flex-col text-xl">
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/png, image/jpeg"
                />
              </div>

              <FormButton onClose={() => setShowImageForm(false)} />
              {imageState.error && (
                <p className="text-center text-sm text-red-400">
                  {imageState.error}
                </p>
              )}
            </form>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showNameForm && (
          <Modal open={showNameForm} onClose={() => setShowNameForm(false)}>
            <form action={nameAction}>
              <h2 className="text-zinc-50 text-center text-xl py-2">
                Change Name
              </h2>
              <div className="flex flex-col text-xl">
                <label htmlFor="new-name" className="text-zinc-50">
                  New Name
                </label>
                <input
                  type="text"
                  id="new-name"
                  name="new-name"
                  className="px-2 py-1 rounded"
                />
              </div>

              <FormButton onClose={() => setShowNameForm(false)} />
              {nameState.error && (
                <p className="text-center text-sm text-red-400">
                  {nameState.error}
                </p>
              )}
            </form>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPasswordForm && (
          <Modal
            open={showPasswordForm}
            onClose={() => setShowPasswordForm(false)}
          >
            <form action={passwordAction}>
              <h2 className="text-zinc-50 text-center text-xl py-2">
                Change Password
              </h2>
              <div className="flex flex-col text-xl pb-4">
                <label htmlFor="current-password" className="text-zinc-50">
                  Current Password
                </label>
                <input
                  type="text"
                  id="current-password"
                  name="current-password"
                  className="px-2 py-1 rounded"
                />
              </div>
              <div className="flex flex-col text-xl">
                <label htmlFor="new-password" className="text-zinc-50">
                  New Password
                </label>
                <input
                  type="text"
                  id="new-password"
                  name="new-password"
                  className="px-2 py-1 rounded"
                />
              </div>

              <FormButton onClose={() => setShowPasswordForm(false)} />
              {passwordState.currentError && (
                <p className="text-center text-sm text-red-400">
                  {passwordState.currentError}
                </p>
              )}
              {passwordState.newError && (
                <p className="text-center text-sm text-red-400">
                  {passwordState.newError}
                </p>
              )}
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function FormButton({ onClose }: { onClose: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex pt-4 pb-2 items-center justify-center gap-8 text-zinc-50">
      <Button disabled={pending} model="secondary" onClick={onClose}>
        Close
      </Button>
      <Button disabled={pending} type="submit">
        {pending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
