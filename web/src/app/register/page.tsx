import { redirect } from "next/navigation";

// RegisterPage redirects legacy English route to standardized Vietnamese /dang-ky.
export default function RegisterPage() {
  redirect("/dang-ky");
}
