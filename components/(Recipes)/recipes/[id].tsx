import { getImageSource } from "@/utils/images";
import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function RecipeDetailScreen() {
  const {
    id,
    name,
    time,
    difficulty,
    calories,
    categories,
    image,
    description,
  } = useLocalSearchParams();
  const imgSource = getImageSource(image as any);
  const categoryList = categories ? String(categories).split(",") : [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {image ? (
        <Image source={imgSource} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Text style={styles.noImage}>No Image</Text>
        </View>
      )}

      <Text style={styles.title}>{name}</Text>

      <Text style={styles.meta}>
        ⏳ {time} min • 🧠 {difficulty} • 🔥 {calories} cal
      </Text>

      <Text style={styles.sectionTitle}>Description:</Text>
      <Text style={styles.description}>{description}</Text>

      <Text style={styles.sectionTitle}>Categories:</Text>
      <View style={styles.catRow}>
        {categoryList.map((cat, idx) => (
          <View key={idx} style={styles.catChip}>
            <Text style={styles.catChipText}>{cat.trim()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  imageFallback: {
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  noImage: { color: "#888", fontSize: 14 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1E1E",
    marginTop: 16,
    marginHorizontal: 20,
  },
  meta: {
    fontSize: 14,
    color: "#777",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 6,
    color: "#333",
  },
  description: {
    fontSize: 15,
    color: "#444",
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 22,
  },
  catRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  catChip: {
    backgroundColor: "#F1F1F1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  catChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
