import { createCategory, getCategories } from "@/api/auth";
import { colors } from "@/colors/colors";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
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

const FeedScreen = () => {
  const queryClient = useQueryClient();

  // Fetch all categories from backend
  const { data, isFetching, refetch } = useQuery<Category[]>({
    queryKey: ["Category"],
    queryFn: getCategories,
  });

  // Track selected category chip
  const [selected, setSelected] = useState<string | null>(null);

  // Modal state for creating category
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Create category using API
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    try {
      // Try creating category on backend
      await createCategory(newCategory.trim());
      setNewCategory("");
      setModalVisible(false);
      refetch();
      await queryClient.invalidateQueries({ queryKey: ["Category"] });
    } catch (error: any) {
      console.log("Create category error:", error);

      // ✅ Check if backend responded with "duplicate" error
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

  if (isFetching) {
    // Show loading spinner while fetching
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.blue} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ---------- Header with Add (+) Button ---------- */}
      <View style={styles.header}>
        <Text style={styles.guestText}>User</Text>
      </View>

      {/* ---------- Categories Section ---------- */}
      <View style={styles.categoriesHeader}>
        {/* Plus button to open modal */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={30} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Category chips list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesRow}
      >
        {data?.map((cat: Category) => (
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
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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

            {/* Input for new category name */}
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={newCategory}
              onChangeText={setNewCategory}
            />

            {/* Modal buttons */}
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
    </ScrollView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
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

  // Header
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

  // Categories
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

  // Modal styles
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
