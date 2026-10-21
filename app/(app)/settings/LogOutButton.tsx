"use client";

import { FiLogOut } from "react-icons/fi";
import { useActiveWorkout } from "@/stores/activeWorkout";

// Submits the server's logOut form, but first wipes the workout saved on this
// phone, so the next person to log in here can't see it.
export function LogOutButton() {
  return (
    <button
      type="submit"
      onClick={() => {
        useActiveWorkout.getState().discard();
        useActiveWorkout.persist.clearStorage();
      }}
      className="flex min-h-14 w-full items-center gap-3 px-4 text-left font-bold text-[#FF8A8A] hover:bg-raised"
    >
      <FiLogOut size={20} />
      Log out
    </button>
  );
}
