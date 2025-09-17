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
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    refetchOnMount: "always",
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
              source={{
                uri: `${BASE_URL}/${String(data.image).replace(/^\/+/, "")}`,
              }}
              style={styles.profileImage}
            />
          )}
        </View>
      </View>

      <Text style={styles.username}>{data.username}</Text>
      <Text style={styles.email}>{data.email}</Text>

      <Text style={styles.sectionTitle}>Recipes</Text>
      {data.recipes && data.recipes.length > 0 ? (
        <FlatList
          style={styles.list}
          data={data.recipes}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
        />
      ) : (
        <Text style={styles.noRecipes}>No recipes added yet.</Text>
      )}
    </View>
  );
};

export default ProfileScreen;

const RecipeCard = ({ recipe }: { recipe: any }) => {
  const imgUri = recipe?.image
    ? recipe.image.startsWith("http")
      ? recipe.image
      : `${BASE_URL}/${String(recipe.image).replace(/^\/+/, "")}`
    : null;

  const cats = Array.isArray(recipe?.categories)
    ? recipe.categories
    : recipe?.category
    ? [recipe.category]
    : [];

  return (
    <View style={styles.recipeCard}>
      {imgUri ? (
        <Image source={{ uri: imgUri }} style={styles.recipeImage} />
      ) : (
        <View style={[styles.recipeImage, styles.recipeImageFallback]}>
          <Text style={styles.noImage}>No Image</Text>
        </View>
      )}

      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <Text style={styles.recipeMeta}>
          ⏱ {Number(recipe.time) || 0} min • {capitalize(recipe.difficulty)}
          {typeof recipe.calories === "number"
            ? ` • 🔥 ${recipe.calories} cal`
            : ""}
        </Text>

        {cats.length > 0 && (
          <View style={styles.catRow}>
            {cats.slice(0, 6).map((c: any) => (
              <View key={c._id} style={styles.catChip}>
                <Text style={styles.catChipText}>{capitalize(c.name)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

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
    padding: 20,
    backgroundColor: "#fff",
  },
  list: { alignSelf: "stretch", width: "100%" },

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
    textAlign: "center",
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  recipeCard: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    marginVertical: 6,
  },
  recipeImage: { width: 90, height: 90, borderRadius: 8 },
  recipeImageFallback: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  noImage: { color: "#888", fontSize: 12 },

  recipeInfo: { flex: 1, paddingLeft: 8, justifyContent: "center" },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  recipeMeta: { fontSize: 13, color: "#777", marginBottom: 6 },

  catRow: { flexDirection: "row", flexWrap: "wrap" },
  catChip: {
    backgroundColor: "#EDEDED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  catChipText: { fontSize: 12, color: "#333", fontWeight: "500" },

  noRecipes: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
  },
});
