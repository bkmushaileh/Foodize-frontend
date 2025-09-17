import { createCategory, getCategories } from "@/api/auth";
import { getAllRecipes } from "@/api/recipes";
import { colors } from "@/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Category = {
  _id: string;
  name: string;
};

type Recipe = {
  _id: string;
  name: string;
  image?: string;
  description: string;
  steps: string[];
  time: number;
  difficulty: string;
  calories?: number;
  categories: { _id: string; name: string; amount: number; unit: string }[];
  user: { _id: string; username?: string; name?: string; image?: string };
};

const FeedScreen = () => {
  const queryClient = useQueryClient();

  // ---------- Categories ----------
  const {
    data: categories,
    isFetching,
    refetch,
  } = useQuery<Category[]>({
    queryKey: ["Category"],
    queryFn: getCategories,
  });

  console.log("HERE", categories);

  const [selected, setSelected] = useState<string | null>(null);

  // New state for the "See All" modal
  const [allCategoriesModalVisible, setAllCategoriesModalVisible] =
    useState(false);

  // ---------- Modal for new category ----------
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    try {
      await createCategory(newCategory.trim());
      setNewCategory("");
      setModalVisible(false);
      refetch();
      await queryClient.invalidateQueries({ queryKey: ["Category"] });
    } catch (error: any) {
      console.log("Create category error:", error);
      if (error.response?.status === 401) {
        Alert.alert("Duplicate", "This category already exists");
      } else if (
        error.response?.data?.message?.toLowerCase().includes("exists")
      ) {
        Alert.alert("Duplicate", "This category already exists");
      } else {
        Alert.alert(
          "Error",
          "Something went wrong while creating the category"
        );
      }
    }
  };

  // ---------- Recipes ----------
  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });

  if (isFetching || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.blue ?? "#4A90E2"} size="small" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() =>
            queryClient.invalidateQueries({ queryKey: ["recipes"] })
          }
        />
      }
    >
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <Text style={styles.guestText}>Guest</Text>
      </View>

      {/* ---------- Categories Section ---------- */}
      <View style={styles.categoriesHeader}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => setAllCategoriesModalVisible(true)}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesRow}
      >
        {categories?.map((cat: Category) => (
          <TouchableOpacity
            key={cat._id}
            onPress={() => setSelected(cat._id)}
            style={[
              styles.categoryChip,
              selected === cat._id && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selected === cat._id && styles.categoryChipTextActive,
              ]}
            >
              {cat.name[0].toUpperCase() + cat.name.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ---------- Recipes Section ---------- */}
      <View style={styles.recipesHeader}>
        <Text style={styles.sectionTitle}>Recipes</Text>
      </View>

      <View style={styles.recipesList}>
        {recipes.map((recipe) => (
          <View key={recipe._id} style={styles.card}>
            {recipe.image ? (
              <Image source={{ uri: recipe.image }} style={styles.cardImg} />
            ) : (
              <View style={styles.cardImgFallback}>
                <Text>No Image</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.recipeTitle}>{recipe.name}</Text>
              <Text style={styles.recipeDesc}>{recipe.description}</Text>
              <Text style={styles.recipeMeta}>
                ⏱ {recipe.time} min · {recipe.difficulty}
                {recipe.calories ?? 0} cal
              </Text>
              <Text style={styles.mutedText}>
                👤 {recipe.user?.username ?? "Unknown"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ---------- Modal for Creating Category ---------- */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Category</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#FFD700" }]}
                onPress={handleCreateCategory}
              >
                <Text style={{ fontWeight: "600" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ---------- Modal for All Categories ---------- */}
      <Modal
        transparent
        animationType="slide"
        visible={allCategoriesModalVisible}
        onRequestClose={() => setAllCategoriesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "70%" }]}>
            <Text style={styles.modalTitle}>All Categories</Text>

            <ScrollView style={{ marginVertical: 10 }}>
              {categories?.length ? (
                categories.map((cat: Category) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor:
                          selected === cat._id ? "#FFD700" : "#eee",
                        marginBottom: 8,
                      },
                    ]}
                    onPress={() => {
                      setSelected(cat._id);
                      setAllCategoriesModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selected === cat._id && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.name[0].toUpperCase() + cat.name.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ textAlign: "center", color: "#666" }}>
                  No categories found.
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: "#FFD700", marginTop: 12 },
              ]}
              onPress={() => setAllCategoriesModalVisible(false)}
            >
              <Text style={{ fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  recipesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recipesList: { gap: 16, marginBottom: 32 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardImg: { width: "100%", height: 160 },
  cardImgFallback: {
    width: "100%",
    height: 160,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: { padding: 12 },
  recipeTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  recipeDesc: { color: "#666", marginBottom: 8 },
  recipeMeta: { color: "#777", marginBottom: 4 },
  errorText: { color: "red", marginBottom: 16 },
  mutedText: { color: "#666" },

  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  guestText: {
    fontSize: 16,
    color: "#555",
  },

  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    color: colors.blue ?? "#4A90E2",
    fontSize: 14,
  },
  categoriesRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#FFD700",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#555",
  },
  categoryChipTextActive: {
    color: "#000",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});
