import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** /profile → 첫 단계로 */
export default function ProfilePage() {
  redirect(routes.profileSkin);
}
