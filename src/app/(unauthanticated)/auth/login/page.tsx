import Auth from "@/components/Auth";
import { login, signup } from "@/lib/actions";
import { verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { AuthFormState } from "@/lib/types";
import { getUserByEmail } from "@/lib/user";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { mode: string };
}) {
  let mode: "login" | "signup" = "login";
  if (searchParams.mode === "signup") mode = "signup";

  const user = await verifyAuth();

  async function authAction(prev: {}, formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const image = formData.get("image") as File;
    let errors: AuthFormState = {};
    if (!email) {
      errors.email = "Please enter a valid email.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }

    if (mode === "signup" && !name) {
      errors.name = "Name is required.";
    }
    if (mode === "signup" && !image.size) {
      errors.image = "Image is required.";
    }

    if (errors.email || errors.password || errors.name || errors.image) {
      return errors as AuthFormState;
    }

    if (mode === "signup") {
      const user = getUserByEmail(email);
      if (user?.email || user?.id) {
        errors.email =
          "Account could not created. Please use a diffrent email.";
        return errors;
      }
      const imageUrl = await uploadImage(image);
      await signup({ email, password, name, image: imageUrl });
    }
    if (mode === "login") {
      const res = await login({ email, password });
      if (res?.error) {
        errors.login = res.error;
      }
    }
    return errors;
  }

  return <Auth mode={mode} user={user.user} authAction={authAction} />;
}
