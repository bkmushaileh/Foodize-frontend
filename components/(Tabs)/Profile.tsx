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

const ProfileScreen = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
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
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          {data.image && (
            <Image
              source={{ uri: `${BASE_URL}/${data.image}` }}
              style={styles.profileImage}
            />
          )}
        </View>
      </View>
      <Text style={styles.username}>{data.username}</Text>
      <Text style={styles.email}>{data.email}</Text>

      <Text style={styles.sectionTitle}>Recipes</Text>
      {data.recipes.length > 0 ? (
        <FlatList
          data={data.recipes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Text style={styles.recipeText}>{item.title}</Text>
            </View>
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
  avatarWrap: {
    alignItems: "center",
    marginBottom: 0,
  },
  avatar: {
    height: 170,
    width: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderColor: colors.yellowLight,
    overflow: "hidden",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E1E1E",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  recipeCard: {
    width: "100%",
    padding: 15,
    marginVertical: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  recipeText: {
    fontSize: 16,
    color: "#333",
  },
  noRecipes: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
});
