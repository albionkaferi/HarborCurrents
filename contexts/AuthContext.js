import React, { useEffect, useMemo, useReducer, createContext } from "react";

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
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      // try {
      //   userToken = await SecureStore.getItemAsync("userToken");
      // } catch (e) {
      //   console.log(e);
      // }

      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data, setError) => {
        try {
          // ** REPLACE "localhost" with your private IPv4 Address
          const response = await fetch("http://192.168.1.7:8080/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (response.status == 200) {
            dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
          } else {
            setError("Invalid Credentials");
          }
        } catch (e) {
          console.log(e);
        }
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
}
