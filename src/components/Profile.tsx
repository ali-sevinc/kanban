"use client";
import { UserType } from "@/lib/types";
import { useState } from "react";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";
import { useFormState } from "react-dom";
import Button from "./Button";

type PropsType = {
  user: UserType;
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
};
export default function Profile({
  user,
  updateImage,
  updateName,
  updatePassword,
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
  // console.log("Image State", imageState);
  // console.log("Name State", nameState);
  // console.log("Password State", passwordState);

  return (
    <>
      <div className="flex flex-col divide-y-2 gap-4 w-72 mx-auto  items-center">
        <button
          onClick={() => setShowImageForm(true)}
          className="w-44 h-44 rounded-full"
        >
          <img
            src={user.image}
            className="rounded-full object-cover w-full h-full"
            alt={`${user.name} profile picture.`}
          />
        </button>

        <div className="flex items-center justify-between w-full">
          <p>{user.name}</p>
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
              <div className="flex items-center justify-center gap-8 pt-4 pb-2 text-zinc-50">
                <Button
                  model="secondary"
                  onClick={() => setShowImageForm(false)}
                >
                  Close
                </Button>
                <Button type="submit">Submit</Button>
              </div>
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
              <div className="flex pt-4 pb-2 items-center justify-center gap-8 text-zinc-50">
                <Button
                  model="secondary"
                  onClick={() => setShowNameForm(false)}
                >
                  Close
                </Button>
                <Button type="submit">Submit</Button>
              </div>
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
              <div className="flex pt-4 pb-2 items-center justify-center gap-8 text-zinc-50">
                <Button
                  model="secondary"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Close
                </Button>
                <Button type="submit">Submit</Button>
              </div>
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
