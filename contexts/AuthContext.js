import React, { useEffect, useMemo, useReducer, createContext } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.error(e);
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (credentials, setError) => {
        try {
          const response = await fetch(
            "https://api.harborcurrents.com/signin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );
          const data = await response.json();
          if (response.status == 200) {
            const token = data.token;
            await SecureStore.setItemAsync("userToken", token);
            dispatch({ type: "SIGN_IN", token: token });
          } else {
            setError("Invalid Credentials");
          }
        } catch (e) {
          console.error(e);
        }
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync("userToken");
          dispatch({ type: "SIGN_OUT" });
        } catch (e) {
          console.error(e);
        }
      },
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
}
