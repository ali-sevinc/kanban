import Profile from "@/components/Profile";
import {
  getUser,
  updateImageById,
  updateNameById,
  updatePasswordById,
} from "@/lib/actions";
import { verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { verifyPassword } from "@/lib/hash";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const isAuth = await verifyAuth();
  if (!isAuth.user || !isAuth.session) redirect("/auth/login");

  const user = await getUser(+isAuth.user.id);

  async function updateImage(prevState: {}, formData: FormData) {
    "use server";
    const image = formData?.get("image") as File;
    if (!image.size || !image) return { error: "Image is Required." };

    const imageUrl = await uploadImage(image);
    if (!imageUrl) return {};
    const res = await updateImageById(imageUrl, user.id);

    return {};
  }

  async function updateName(prevState: {}, formData: FormData) {
    "use server";
    const name = formData?.get("new-name") as string;
    if (name.trim().length < 3) return { error: "Name is Required." };

    const res = await updateNameById(name, user.id);

    return {};
  }

  async function updatePassword(prevState: {}, formData: FormData) {
    "use server";
    const currentPas = formData?.get("current-password") as string;
    const newPas = formData?.get("new-password") as string;
    const validOldPassword = verifyPassword(user.password, currentPas);

    if (!validOldPassword)
      return {
        currentError: "Wrong password.",
      };
    if (newPas.trim().length < 3)
      return {
        newError: "Please enter a valid password.",
      };

    await updatePasswordById(newPas, user.id);

    return {};
  }

  return (
    <Profile
      user={user}
      updateImage={updateImage}
      updateName={updateName}
      updatePassword={updatePassword}
    />
  );
}
