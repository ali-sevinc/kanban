import Auth from "@/components/Auth";
import { login, signup } from "@/lib/actions";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { AuthFormState } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { mode: string };
}) {
  let mode: "login" | "signup" = "login";
  if (searchParams.mode === "signup") mode = "signup";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

    let imageUrl = "";
    if (mode === "signup") {
      try {
        imageUrl = await uploadImage(image);

        const user = await signup({ email, password, name, image: imageUrl });
        return { user } as AuthFormState;
      } catch (error) {
        const publicId = "kanban" + imageUrl.split("/kanban")[1].split(".")[0];

        if (!publicId) return errors;

        await deleteImage(publicId);
        errors.email =
          "Account could not created. Please use a diffrent email.";
        return errors;
      }
    }
    if (mode === "login") {
      try {
        const res = await login({ email, password });
        return { user: res } as AuthFormState;
      } catch (error) {
        errors.login = "Could not login.";
        return errors as AuthFormState;
      }
    }
    return errors;
  }

  if (user) redirect("/boards");

  return <Auth mode={mode} authAction={authAction} loggedUser={user} />;
}
