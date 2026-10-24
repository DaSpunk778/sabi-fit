"use server";

import { refresh } from "next/cache";
import { updateName } from "@/lib/data/profiles";

export type NameState = { error?: string; saved?: boolean};

export async function saveName(
    _prev: NameState,
    formData: FormData,
): Promise<NameState> {
    const raw = formData.get("name");
   // Trim the ends and squash double spaces: "  Ayo   Mide " → "Ayo Mide"
   const name = typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : "";
   
   if (!name) return { error: "Your name can't be empty, my guy!"};
   if (name.length > 40) return { error: "Profile name cannot exceed 40 characters."};

   try {
     await updateName(name);
   } catch (error) {
    console.error(error);
    return { error: "Couldn't save. Check your connection and try again."};
   }

   refresh(); // re-render this page so it shows the new name
   return { saved: true};
}