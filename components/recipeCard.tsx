import { colors } from "@/colors/colors";
import { getImageSource } from "@/utils/images";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type Recipe = {
  description: string;
  _id: string;
  name: string;
  image: string;
  time: number;
  difficulty: string;
  calories: number;
  categories: { _id: string; name: string }[];
};

const capitalize = (t?: string) =>
  t ? t.charAt(0).toUpperCase() + t.slice(1) : "";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const imgSource = getImageSource(recipe?.image);
  const cats = Array.isArray(recipe?.categories) ? recipe.categories : [];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/recipes/[id]",
          params: {
            id: recipe._id,
            name: recipe.name,
            time: recipe.time,
            difficulty: recipe.difficulty,
            calories: recipe.calories,
            categories: recipe.categories.map((c) => c.name).join(","),
            image: recipe.image,
            description: String(recipe.description ?? ""),
          },
        })
      }
    >
      <View style={styles.card}>
        {imgSource ? (
          <Image source={imgSource} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={styles.noImage}>No Image</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {recipe.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            ⏳ {Number(recipe.time) || 0} min • 🧠{" "}
            {capitalize(String(recipe.difficulty))} • 🔥
            {Number(recipe.calories) || 0} cal
          </Text>

          {!!cats.length && (
            <View style={styles.catRow}>
              {cats.slice(0, 6).map((c) => (
                <View key={c._id} style={styles.catChip}>
                  <Text style={styles.catChipText}>{capitalize(c.name)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.blueLight,
    padding: 10,
    marginVertical: 6,
  },
  image: { width: 90, height: 90, borderRadius: 8 },
  imageFallback: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  noImage: { color: "#888", fontSize: 12 },
  info: { flex: 1, paddingLeft: 8, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  meta: { fontSize: 13, color: "#777", marginBottom: 6 },
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
});
