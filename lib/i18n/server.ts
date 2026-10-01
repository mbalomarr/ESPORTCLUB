import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";
import { dictionaries } from "./dictionary";

export const LANG_COOKIE = "lang";

export async function getLang(): Promise<Lang> {
  return (await cookies()).get(LANG_COOKIE)?.value === "ar" ? "ar" : "en";
}

export async function getDictionary() {
  return dictionaries[await getLang()];
}
