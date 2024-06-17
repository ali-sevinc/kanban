"use client";
import { BoardType, UserType } from "@/lib/types";
import { useState } from "react";
import Modal from "./Modal";
import { AnimatePresence } from "framer-motion";

type PropsType = { user: UserType; boards: BoardType[] };
export default function Profile({ user, boards }: PropsType) {
  const [showImageForm, setShowImageForm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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
          />
        </button>

        <div className="flex items-center justify-between w-full">
          <p>{user.name}</p>
          <button onClick={() => setShowNameForm(true)}>Change Name</button>
        </div>
        <div className="w-full text-center">
          <button onClick={() => setShowPasswordForm(true)}>
            Change Password
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {showImageForm && (
          <Modal open={showImageForm} onClose={() => setShowImageForm(false)}>
            <form>
              <label htmlFor="image">Image</label>
              <input type="file" id="image" />
            </form>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showNameForm && (
          <Modal open={showNameForm} onClose={() => setShowNameForm(false)}>
            <form>
              <label htmlFor="new-name">New Name</label>
              <input type="text" id="new-name" />
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
            <form>
              <div>
                <label htmlFor="current-password">Current Password</label>
                <input type="text" id="current-password" />
              </div>
              <div>
                <label htmlFor="">New Password</label>
                <input type="text" id="new-password" />
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
