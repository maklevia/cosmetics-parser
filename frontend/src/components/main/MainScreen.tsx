//THIS SCREEN IS BUILD ONLY FOR TESTING AUTHORISATION AND AUTHENTICATION PURPOSES
//my idea and description, ai help in implementing

import api from "@/api";
import { AbsoluteCenter, Button, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserInfo() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  async function getUserInfo() {
    try {
      const userInfo = await api.get("/main", {
        validateStatus: (status) => {
          return status === 401 || status === 200;
        },
      });
      if (userInfo.status === 401) {
       await handleRefreshRequest();
      } else {
        setUserData(userInfo.data);
      }
    } catch (error) {
      console.log("FE: error fetching user data from server: ", error);
    }
  }

  async function handleRefreshRequest() {
    try {
      const response = await api.post('/auth/refresh', {}, {
        validateStatus: (status) => {
          return status === 401 || status === 200;
        },
      });
      if (response.status === 401) {
        //request to logout (empty tokens)
        navigate("/");
      } else {
        // Successfully refreshed, try fetching user info again
        getUserInfo();
      }
    } catch (error) {
      console.log("FE: error handling refresh request: ", error);
    }
  }

  useEffect(() => {
    const initFetch = async () => {
      await getUserInfo();
    };
    initFetch();
  }, []);

  return (
    <>
     <div>hi</div>
     <div>
       {userData ? (
         <pre>{JSON.stringify(userData, null, 2)}</pre>
       ) : (
         <p>Loading user data...</p>
       )}
     </div>
    </>
  );
}

export default function MainScreen() {
  const navigate = useNavigate();
  async function handleLogout() {
    await api.post('/auth/logout');
    navigate('/login');
  }
  return (
    <AbsoluteCenter>
      <Stack>
        <h1>User Info</h1>
        <UserInfo />
        <Button onClick={handleLogout}>Log Out</Button>
      </Stack>
    </AbsoluteCenter>
  );
}
