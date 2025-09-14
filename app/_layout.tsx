import { getToken } from "@/api/storage";
import { colors } from "@/colors/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AuthContext from "./context/AuthContext";

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  console.log(isAuthenticated);

  const checkToken = async () => {
    const token = await getToken();
    if (token) {
      setIsAuthenticated(true);
      console.log(token);
    }
  };
  useEffect(() => {
    checkToken();
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <Stack screenOptions={{ headerTintColor: colors.yellowDark }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/signup"
            options={{ title: "Sign Up", headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="auth/signIn"
            options={{ title: "Sign In", headerBackTitle: "Back" }}
          />
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                headerBackVisible: false,
              }}
            />
          </Stack.Protected>
        </Stack>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
