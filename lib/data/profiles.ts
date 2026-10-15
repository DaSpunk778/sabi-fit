import { createClient } from "@/lib/supabase/server";

/** Name and email of the logged-in user, or null if nobody is logged in. */
export async function getAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle<{ name: string }>();

  if (error) throw new Error(`Couldn't load your profile: ${error.message}`);

  return {
    name: profile?.name ?? "",
    email: user.email ?? "",
  };
}
