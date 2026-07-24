import { api } from "@/api";
import type { UserInfo } from "@/components/profile/types/UserTypes";
import { useEffect, useState } from "react";

interface HookOutput {
  userInfo?: UserInfo;
}

export function useProfile(): HookOutput {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await api.get<UserInfo>("/user/profile");
        setUserInfo(response.data);
      } catch (error) {
        console.log("FE: Error fetching user info: ", error);
      }
    };

    getUserInfo();
  }, []);

  return { userInfo };
}
