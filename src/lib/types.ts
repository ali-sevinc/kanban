import { Session, User } from "lucia";

export type ProgressType = "todo" | "doing" | "done";
export type TaskType = {
  id: number;
  progress: ProgressType;
  body: string;
  title: string;
  board_id: string;
};
export type BoardType = {
  title: string;
  slug: string;
  id: number;
  user_id: string;
};
export type UserType = {
  email: string;
  password: string;
  id: number;
  name: string;
  image: string;
};
export type UserVerifyType =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };

export type ArchiveType = {
  id: number;
  title: string;
  body: string;
  progress: ProgressType;
  board_name: string;
  user_id: string;
};

export type AuthFormState = {
  email?: string;
  password?: string;
  name?: string;
  image?: string;
  login?: string;
};
