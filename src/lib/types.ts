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
export type UserType =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };
