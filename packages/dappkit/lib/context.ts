import { createContext } from "react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { UserStore } from "../store/user";
import { rootStore } from "../store";

export const UserContext = createContext<User | undefined>(undefined);

export function useCurrentUser() {
  const { data: session } = useSession();
  const user = rootStore.get(UserStore);
  if (!user.isLogin && session) {
    //@ts-ignore
    rootStore.get(UserStore).set(session.user);
  }
  return session?.user;
}
