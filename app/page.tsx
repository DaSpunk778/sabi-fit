import { redirect } from "next/navigation";

// The public landing page is a later milestone. Until it exists, send
// visitors to Welcome (the proxy forwards logged-in users on to /app).
export default function Home() {
  redirect("/welcome");
}
