import { colors } from "@/colors/colors";
import { Tabs } from "expo-router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function RootLayout() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.yellowDark,
        animation: "shift",
        headerTintColor: colors.yellowLight,
      }}
    ></Tabs>
  );
}
