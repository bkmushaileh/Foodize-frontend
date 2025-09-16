import { deleteToken, getToken } from "@/api/storage";
import { colors } from "@/colors/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Tabs } from "expo-router";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import AuthContext from "../context/AuthContext";
export default function RootLayout() {
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogOut = async () => {
    await deleteToken();
    const token = await getToken();
    console.log("After delete:", token);
    setIsAuthenticated(false);
    router.dismissTo("/landingPage");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.yellowDark,
        animation: "shift",
        headerTintColor: colors.yellowLight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="food-bank"
              size={24}
              color={colors.yellowDark}
            />
          ),

          headerRight: () => (
            <React.Fragment>
              <TouchableOpacity onPress={handleLogOut}>
                <MaterialIcons name="logout" size={20} color={colors.error} />
              </TouchableOpacity>
            </React.Fragment>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => (
            <Entypo
              name="circle-with-plus"
              size={20}
              color={colors.yellowDark}
            />
          ),

          headerRight: () => (
            <React.Fragment>
              <TouchableOpacity onPress={handleLogOut}>
                <MaterialIcons name="logout" size={20} color={colors.error} />
              </TouchableOpacity>
            </React.Fragment>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={20} color={colors.yellowDark} />
          ),

          headerRight: () => (
            <React.Fragment>
              <TouchableOpacity onPress={handleLogOut}>
                <MaterialIcons name="logout" size={20} color={colors.error} />
              </TouchableOpacity>
            </React.Fragment>
          ),
        }}
      />
    </Tabs>
  );
}
