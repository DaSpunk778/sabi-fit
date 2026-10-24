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
/** Change the logged-in user's name. RLS only lets them update their own row. */
export async function updateName(name: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id)
    .select("id");

    if (error) throw new Error(`Couldn't save your name: ${error.message}`);
    // An update that matches no row isn't an error in SQL; catch it ourselves.
    if (data.length === 0) throw new Error("No profile row to update")
}