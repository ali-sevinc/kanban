import { login, signup } from "@/lib/actions";

import Button from "./Button";
import { uploadImage } from "@/lib/cloudinary";
import Link from "next/link";
import { getUserByEmail } from "@/lib/user";

const inputClass =
  "text-zinc-900 w-full text-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded";

export default function Login({ mode }: { mode: "login" | "signup" }) {
  async function authAction(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as File;

    if (!email || !password) return;
    if (mode === "signup" && (!name || !image)) return;

    if (mode === "signup") {
      const user = getUserByEmail(email);
      if (user.email || user.id) return;
      const imageUrl = await uploadImage(image);
      signup({ email, password, name, image: imageUrl });
    }
    if (mode === "login") {
      login({ email, password });
    }
  }
  console.log(mode);

  return (
    <form
      action={authAction}
      // onSubmit={handleSubmit}
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
      </div>

      {mode === "signup" && (
        <div className="flex flex-col">
          <label className="text-lg" htmlFor="name">
            Name
          </label>
          <input className={inputClass} type="text" id="name" name="name" />
        </div>
      )}
      {mode === "signup" && (
        <div className="flex flex-col">
          <label className="text-lg" htmlFor="image">
            Image
          </label>
          <input
            className={inputClass}
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </div>
      )}
      <div className="flex justify-between">
        <Button type="submit">{mode === "login" ? "Login" : "Singup"}</Button>
      </div>
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
