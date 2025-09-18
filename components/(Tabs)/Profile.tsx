import { getProfile } from "@/api/auth";
import BASE_URL from "@/api/baseurl";
import { colors } from "@/colors/colors";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RecipeCard from "../recipeCard";

const ProfileScreen = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  if (isFetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={colors.yellowDark} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No profile data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: `${BASE_URL}/${String(data.image).replace(/^\/+/, "")}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{data.username}</Text>
        <Text style={styles.email}>{data.email}</Text>
      </View>
      <Text style={styles.sectionTitle}>Recipes</Text>
      {data.recipes && data.recipes.length > 0 ? (
        <FlatList
          style={styles.list}
          data={data.recipes}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={{
                _id: item._id,
                name: item.name,
                image: item.image,
                time: item.time,
                difficulty: item.difficulty,
                calories: item.calories,
                categories: Array.isArray(item.categories)
                  ? item.categories
                  : item.category
                  ? [item.category]
                  : [],
                description: item.description,
              }}
            />
          )}
        />
      ) : (
        <Text style={styles.noRecipes}>No recipes added yet.</Text>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: colors.blueLight,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#777",
  },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  list: { alignSelf: "stretch", width: "100%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileImage: { width: "100%", height: "100%", resizeMode: "cover" },

  noRecipes: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
});
