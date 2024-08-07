"use client";
import Link from "next/link";

import Button from "./Button";
import { useFormState, useFormStatus } from "react-dom";
import { AuthFormState } from "@/lib/types";
import { User } from "@supabase/supabase-js";

const inputClass =
  "text-zinc-900 w-full text-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded";

export default function Auth({
  mode,
  authAction,
  loggedUser,
}: {
  mode: "login" | "signup";
  authAction: (prev: {}, formData: FormData) => Promise<AuthFormState>;
  loggedUser: User | null;
}) {
  const [state, formAction] = useFormState(authAction, {} as AuthFormState);

  return (
    <form
      action={formAction}
      className="max-w-xl mx-auto p-24 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold">
        {mode === "login" ? "Login" : "Create Account"}
      </h2>

      <div className="flex flex-col">
        <label className="text-lg" htmlFor="email">
          Email
        </label>
        <input className={inputClass} id="email" name="email" type="email" />
        {state?.email && <p className="text-red-500">{state.email}</p>}
      </div>
      <div className="flex flex-col">
        <label className="text-lg" htmlFor="password">
          Password
        </label>
        <input
          className={inputClass}
          id="password"
          name="password"
          type="password"
        />
        {state?.password && <p className="text-red-500">{state.password}</p>}
      </div>

      {mode === "signup" && (
        <div className="flex flex-col">
          <label className="text-lg" htmlFor="name">
            Name
          </label>
          <input className={inputClass} type="text" id="name" name="name" />
          {state?.name && <p className="text-red-500">{state.name}</p>}
        </div>
      )}
      {mode === "signup" && (
        <div className="flex flex-col ">
          <label className="text-lg" htmlFor="image">
            Image
          </label>
          <input
            className={`text-zinc-50 ${inputClass} bg-zinc-50`}
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
          {state?.image && <p className="text-red-500">{state.image}</p>}
        </div>
      )}
      <FormButton mode={mode} />
      {state.login && <p className="text-red-500">{state.login}</p>}
      {mode === "login" && (
        <Link href="/auth/login/?mode=signup">
          Do you need an accound? Go to Signup
        </Link>
      )}
      {mode === "signup" && (
        <Link href="/auth/login/?mode=login">
          Have an accound? Go to Login!
        </Link>
      )}
    </form>
  );
}

function FormButton({ mode }: { mode: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex justify-between">
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : mode === "login" ? "Login" : "Singup"}
      </Button>
    </div>
  );
}
