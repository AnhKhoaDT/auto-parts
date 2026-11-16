import { redirect } from "next/navigation";

// LoginPage redirects legacy English route to standardized Vietnamese /dang-nhap.
export default function LoginPage() {
  redirect("/dang-nhap");
}
