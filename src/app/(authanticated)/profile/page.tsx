import Profile from "@/components/Profile";
import {
  getUser,
  updateImageById,
  updateNameById,
  updatePasswordById,
} from "@/lib/actions";
import { uploadImage } from "@/lib/cloudinary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user: isAuth },
  } = await supabase.auth.getUser();

  if (!isAuth) {
    return redirect("/auth/login");
  }

  const user = await getUser();

  async function updateImage(prevState: {}, formData: FormData) {
    "use server";
    const image = formData?.get("image") as File;
    if (!image.size || !image) return { error: "Image is Required." };

    const imageUrl = await uploadImage(image);
    if (!imageUrl) return {};
    const res = await updateImageById(imageUrl);

    return {};
  }

  async function updateName(prevState: {}, formData: FormData) {
    "use server";
    const name = formData?.get("new-name") as string;
    if (name.trim().length < 3) return { error: "Name is Required." };

    const res = await updateNameById(name);

    return {};
  }

  async function updatePassword(prevState: {}, formData: FormData) {
    "use server";
    const currentPas = formData?.get("current-password") as string;
    const newPas = formData?.get("new-password") as string;

    if (!isAuth || !isAuth?.email)
      return {
        currentError: "User Not Found!",
      };

    if (newPas.trim().length < 3)
      return {
        newError: "Please enter a valid password.",
      };
    const res = await updatePasswordById(isAuth.email, currentPas, newPas);

    return res || {};
  }

  return (
    <Profile
      updateImage={updateImage}
      updateName={updateName}
      updatePassword={updatePassword}
      user={user}
    />
  );
}
